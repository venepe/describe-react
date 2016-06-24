'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import styles from './MyCollaborationsView.css';
import { Paper, FloatingActionButton, FontIcon } from 'material-ui';
import CollaborationListView from '../CollaborationListView';
import MyCollaborationsPlaceholder from '../MyCollaborationsPlaceholder';
import MyCollaborationsToolbar from '../MyCollaborationsToolbar';
import SMTIStorage from '../../utils/storage';

import { registerDidIntroduceCollaboration } from '../../stores/SubscriptionStore';
import { DidIntroduceCollaborationSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class MyCollaborationsView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushInvitations = this._pushInvitations.bind(this);
    this._onPressRow = this._onPressRow.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
  }

  _pushInvitations() {
    this.router.push('myinvitations');
  }

  _onPressRow(collaboration) {
    this.router.push(`/projects/${collaboration.id}/testCases`);
  }

  _onEndReached(cursor) {
    var first = this.props.relay.variables.first;
    this.props.relay.setVariables({
      first: first + _next,
      after: cursor
    });
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.me) {
      let me = this.props.me;
      let meId = me.id;

      registerDidIntroduceCollaboration({meId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceCollaborationSubscription({me})
        );
      });
    }
  }

  render() {

    if(this.props.me) {
      var me = this.props.me;
      if (me.originalCollaborations.edges.length > 0) {
        return (
          <div className="MyCollaborations-container">
            <MyCollaborationsToolbar title={'Collaborations'} onClick={this._pushInvitations} />
            <CollaborationListView collaborations={this.props.me.originalCollaborations} me={this.props.me} onPressRow={this._onPressRow} onEndReached={this._onEndReached}/>
          </div>
        );
      } else {
        return (
          <div>
            <MyCollaborationsToolbar title={'Collaborations'} onClick={this._pushInvitations} />
            <MyCollaborationsPlaceholder />
          </div>
        );
      }
    } else {
      return (
        <div>
          <MyCollaborationsToolbar title={'Collaborations'} onClick={this._pushInvitations} />
          <MyCollaborationsPlaceholder />
        </div>
      );
    }
  }
}

export default Relay.createContainer(MyCollaborationsView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    me: () => Relay.QL`
    fragment on User {
      id
      originalCollaborations: collaborations(first: $first) {
        edges
        ${CollaborationListView.getFragment('collaborations')},
      }
      moreCollaborations: collaborations(first: $moreFirst, after: $after) {
        ${CollaborationListView.getFragment('collaborations')},
      }
      ${DidIntroduceCollaborationSubscription.getFragment('me')},
      ${CollaborationListView.getFragment('me')},
    }
    `,
  },
});
