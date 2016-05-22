'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import styles from './MyInvitationsView.css';
import { Paper, FloatingActionButton, FontIcon } from 'material-ui';
import InvitationListView from '../InvitationListView';
import MyInvitationsPlaceholder from '../MyInvitationsPlaceholder';
import SMTIToolbar from '../SMTIToolbar';
import SMTIStorage from '../../utils/storage';

import { registerDidIntroduceInvitation } from '../../stores/SubscriptionStore';
import { DidIntroduceInvitationSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class MyInvitationsView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onPressRow = this._onPressRow.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
  }

  _onPressRow(invitation) {
    this.router.push(`/invitations/${invitation.id}`);
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

      registerDidIntroduceInvitation({meId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceInvitationSubscription({me})
        );
      });
    }
  }

  render() {

    if(this.props.me) {
      var me = this.props.me;
      if (me.originalInvitations.edges.length > 0) {
        return (
          <div className="MyInvitations-container">
            <SMTIToolbar title={'Invitations'} />
            <InvitationListView invitations={this.props.me.originalInvitations} me={this.props.me} onPressRow={this._onPressRow} onEndReached={this._onEndReached}/>
          </div>
        );
      } else {
        return (
          <div>
            <SMTIToolbar title={'Invitations'} />
            <MyInvitationsPlaceholder />
          </div>
        );
      }
    } else {
      return (
        <div>
          <SMTIToolbar title={'Invitations'} />
          <MyInvitationsPlaceholder />
        </div>
      );
    }
  }
}

export default Relay.createContainer(MyInvitationsView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    me: () => Relay.QL`
    fragment on User {
      id
      originalInvitations: invitations(first: $first) {
        edges
        ${InvitationListView.getFragment('invitations')},
      }
      moreInvitations: invitations(first: $moreFirst, after: $after) {
        ${InvitationListView.getFragment('invitations')},
      }
      ${DidIntroduceInvitationSubscription.getFragment('me')},
      ${InvitationListView.getFragment('me')},
    }
    `,
  },
});
