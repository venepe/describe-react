'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import Infinite from 'react-infinite';
import styles from './FulfillmentEventListView.css';
import SpinnerView from '../SpinnerView';
import { Card, CardMedia } from 'material-ui';
import moment from 'moment';

const _first = 5;
const _next = 5;

class FulfillmentEventListView extends Component {
  static propTypes = {
    onPressRow: PropTypes.func,
    onEndReached: PropTypes.func
  }

  static defaultProps = {
    onPressRow: function() {},
    onEndReached: function() {}
  }

  constructor(props) {
    super(props);
    this._getInitialState = this._getInitialState.bind(this);
    this.buildElements = this.buildElements.bind(this);
    this._onEndReached = this._onEndReached.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      hasNextPage: false,
      elements: this.buildElements(this.props.fulfillment.events)
    };
  }

  _getUpdatedState(events) {
    return {
      hasNextPage: false,
      elements: this.buildElements(events)
    };
  }

  renderImage(previous, current) {
    if (previous !== current) {
      return (
        <div>
          <CardMedia className='FulfillmentEventImage-container' expandable={true}>
            <img className='FulfillmentEventImage-img' height={400} src={current} />
          </CardMedia>
        </div>
      );
    } else {
      return null;
    }
  }

  buildElements(events) {
    return events.edges.map((object, index) => {
      let status = object.node.status;
      let author = object.node.author;
      let current = object.node.uri;
      let previous = (index === 0) ? null : events.edges[index - 1].node.uri;
      return (
        <Card key={index} className="FulfillmentEvent-container">
          {this.renderImage(previous, current)}
          <div className="event-row">
            <div>{status}</div>
            <div className="sub-container">
              <div className="author">{author.name}</div>
              <div className="date-created">{moment(object.node.createdAt).format('MMM DD, YYYY hh:mm A')}</div>
            </div>
          </div>
        </Card>
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fulfillment) {
      this.setState(this._getUpdatedState(nextProps.fulfillment.events));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.fulfillment.events.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.fulfillment.events.edges;
    if (edges.length > 0) {
      let cursor = edges[edges.length - 1].cursor;
      let first = this.props.relay.variables.first;
      this.props.relay.setVariables({
        first: first + _next,
        after: cursor
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
      <Infinite elementHeight={340}
                       containerHeight={window.screen.height}
                       infiniteLoadBeginBottomOffset={100}
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

export default Relay.createContainer(FulfillmentEventListView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on Fulfillment {
        id
        events (first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              status
              uri
              createdAt
              author {
                name
              }
            }
          }
        }
        moreEvents: events(first: $moreFirst, after: $after) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              status
              uri
              createdAt
              author {
                name
              }
            }
          }
        }
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  },
});
