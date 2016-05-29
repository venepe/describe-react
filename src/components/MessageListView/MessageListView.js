'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import Infinite from 'react-infinite';
import moment from 'moment';
import { Card, CardHeader, CardText } from 'material-ui';
import styles from './MessageListView.css';
import SpinnerView from '../SpinnerView';

import { IntroduceMessageMutation } from '../../mutations';
import { registerDidIntroduceMessage } from '../../stores/SubscriptionStore';
import { DidIntroduceMessageSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class MessageListView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    onPressRow: PropTypes.func,
    onEndReached: PropTypes.func
  }

  static defaultProps = {
    onPressRow: function() {},
    onEndReached: function() {}
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._getInitialState = this._getInitialState.bind(this);
    this.buildElements = this.buildElements.bind(this);
    this._onEndReached = this._onEndReached.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      hasNextPage: false,
      elements: this.buildElements(this.props.channel.messages)
    };
  }

  _getUpdatedState(messages) {
    return {
      hasNextPage: false,
      elements: this.buildElements(messages)
    };
  }

  buildElements(messages) {
    return messages.edges.map((object, index) => {
      let message = object.node;

      return (
        <Card key={index}>
          <CardHeader title={message.author.name} subtitle={moment(message.createdAt).format('MMM DD, YYYY hh:mm A')} avatar={message.author.cover.uri}>
          </CardHeader>
          <CardText>
            {message.text}
          </CardText>
        </Card>
      );
    }).reverse();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel) {
      this.setState(this._getUpdatedState(nextProps.channel.messages));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.channel.messages.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.channel.messages.edges;
    if (edges.length > 0) {
      let cursor = edges[edges.length - 1].cursor;
      let first = this.props.relay.variables.first;
      this.props.relay.setVariables({
        first: first + _next,
        after: cursor
      });
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.channel) {
      let channel = this.props.channel;
      let channelId = channel.id;

      registerDidIntroduceMessage({channelId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceMessageSubscription({channel})
        );
      });
    }
  }


  elementInfiniteLoad() {
      return (
          <SpinnerView />
      );
  }

  render() {
      return (
          <Infinite elementHeight={97}
                           containerHeight={window.screen.height}
                           infiniteLoadBeginBottomOffset={200}
                           onInfiniteLoad={this._onEndReached}
                           loadingSpinnerDelegate={this.elementInfiniteLoad()}
                           isInfiniteLoading={this.state.hasNextPage}
                           useWindowAsScrollContainer={true}
                           >
              {this.state.elements}
          </Infinite>
      );
  }
}

export default Relay.createContainer(MessageListView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    channel: () => Relay.QL`
      fragment on Channel {
        id
        messages(first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              text
              createdAt
              author {
                id
                name
                cover {
                  id
                  uri
                }
              }
            }
          }
        }
        moreMessages: messages(first: $moreFirst, after: $after) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              text
              createdAt
              author {
                id
                name
                cover {
                  id
                  uri
                }
              }
            }
          }
        }
        ${IntroduceMessageMutation.getFragment('channel')},
        ${DidIntroduceMessageSubscription.getFragment('channel')},
      }
    `
  },
});
