'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import Infinite from 'react-infinite';
import styles from './InviteeListView.css';
import SpinnerView from '../SpinnerView';
import InviteeListToolbar from '../InviteeListToolbar';
import InviteeListCellView from '../InviteeListCellView';
import InviteeListPlaceholder from '../InviteeListPlaceholder';

import { registerDidIntroduceInvitee } from '../../stores/SubscriptionStore';
import { DidIntroduceInviteeSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class InviteeListView extends Component {
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
    this._onClick = this._onClick.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      hasNextPage: false,
      elements: this.buildElements(this.props.project.invitees)
    };
  }

  _getUpdatedState(invitees) {
    return {
      hasNextPage: false,
      elements: this.buildElements(invitees)
    };
  }

  _onClick(invitee) {
    let userId = invitee.profile.id;
    this.router.push(`/users/${userId}`);
  }

  buildElements(invitees) {
    return invitees.edges.map((object, index) => {
      let invitee = object.node;

      return (
        <InviteeListCellView key={index} invitee={invitee} project={this.props.project} onClick={this._onClick} />
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project) {
      this.setState(this._getUpdatedState(nextProps.project.invitees));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.project.invitees.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.project.invitees.edges;
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

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.project) {
      let project = this.props.project;
      let projectId = project.id;

      registerDidIntroduceInvitee({projectId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceInviteeSubscription({project})
        );
      });
    }
  }

  render() {
    if (this.props.project.invitees.edges.length > 0) {
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
    } else {
      return (<InviteeListPlaceholder />);
    }
  }
}

export default Relay.createContainer(InviteeListView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        invitees (first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${InviteeListCellView.getFragment('invitee')},
            }
          }
        }
        moreInvitees: invitees(first: $moreFirst, after: $after) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${InviteeListCellView.getFragment('invitee')},
            }
          }
        }
        ${InviteeListCellView.getFragment('project')},
        ${DidIntroduceInviteeSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
});
