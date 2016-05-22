'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './InvitationListCellView.css';
import { Card, CardMedia, CardTitle, CardText, FlatButton } from 'material-ui';

import { AcceptInvitationMutation, DeclineInvitationMutation } from '../../mutations';

import { registerDidAcceptInvitation, registerDidDeclineInvitation } from '../../stores/SubscriptionStore';
import { DidAcceptInvitationSubscription, DidDeclineInvitationSubscription } from '../../subscriptions';

class InvitationListCellView extends Component {
  static propTypes = {
    key: PropTypes.number,
    onClick: PropTypes.func
  }

  static defaultProps = {
    key: 0,
    onClick: function() {}
  }

  constructor(props) {
    super(props);
    this._onAccept = this._onAccept.bind(this);
    this._onDecline = this._onDecline.bind(this);
  }

  _onAccept() {
    Relay.Store.commitUpdate(
      new AcceptInvitationMutation({invitation: this.props.invitation, me: this.props.me})
    );
  }

  _onDecline() {
    Relay.Store.commitUpdate(
      new DeclineInvitationMutation({invitation: this.props.invitation, me: this.props.me})
    );
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.invitation && this.props.me) {
      let invitation = this.props.invitation;
      let me = this.props.me;
      let invitationId = invitation.id;
      let meId = me.id;

      registerDidAcceptInvitation({invitationId, meId}, () => {
        return Relay.Store.subscribe(
          new DidAcceptInvitationSubscription({invitation, me})
        );
      });
      registerDidDeclineInvitation({invitationId, meId}, () => {
        return Relay.Store.subscribe(
          new DidDeclineInvitationSubscription({invitation, me})
        );
      });
    }
  }

  render() {
    let invitation = this.props.invitation;

    let subtitleText = this.props.invitation.sponsor.name;
    let subtitle = (<div><div style={{float: 'left', paddingBottom: 16}}>{subtitleText}</div><div style={{float: 'right'}}><FlatButton onMouseUp={this._onDecline} onTouchEnd={this._onDecline} labelStyle={{color:'#FFC107'}} label='Decline' /><FlatButton labelStyle={{color:'#FFC107'}} onMouseUp={this._onAccept} onTouchEnd={this._onAccept} label='Accept' /></div></div>)
    return (
      <Card key={this.props.key}>
        <CardTitle title={invitation.project.title} subtitle={subtitle} />
      </Card>
    );
  }
}

export default Relay.createContainer(InvitationListCellView, {
  fragments: {
    invitation: () => Relay.QL`
      fragment on Invitation {
        id
        project {
          title
        }
        sponsor {
          id
          name
          cover {
            id
            uri
          }
        }
        ${AcceptInvitationMutation.getFragment('invitation')},
        ${DeclineInvitationMutation.getFragment('invitation')},
        ${DidAcceptInvitationSubscription.getFragment('invitation')},
        ${DidDeclineInvitationSubscription.getFragment('invitation')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
        ${AcceptInvitationMutation.getFragment('me')},
        ${DeclineInvitationMutation.getFragment('me')},
        ${DidAcceptInvitationSubscription.getFragment('me')},
        ${DidDeclineInvitationSubscription.getFragment('me')},
      }
    `,
  },
});
