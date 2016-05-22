'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from './InvitationListCellView.css';
import { Card, CardMedia, CardTitle, CardText, FlatButton } from 'material-ui';
import CollaboratorIcon from '../CollaboratorIcon';

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
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this._showConfirmationDialog = this._showConfirmationDialog.bind(this);
    this.renderBuiltWith = this.renderBuiltWith.bind(this);
    this.state = {
      showConfirmationDialog: false
    };
  };

  _showConfirmationDialog() {
    this.setState({
      showConfirmationDialog: true
    });
  }

  _dismissConfirmationDialog() {
    this.setState({
      showConfirmationDialog: false
    });
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

  renderBuiltWith() {
    let invitation = this.props.invitation;
    let project = invitation.project;
    if (project.collaborators && project.collaborators.edges.length > 0) {
      return project.collaborators.edges.map(function (object, index) {
        let collaborator = object.node;
        return (<CollaboratorIcon key={index} collaborator={collaborator} project={project} />)
      });
    } else {
      return [];
    }
  }

  render() {
    let invitation = this.props.invitation;
    let project = invitation.project;
    let percentFulfilled = parseInt(project.numOfTestCasesFulfilled / project.numOfTestCases * 100) || 0;
    let color = percentFulfilled < 50 ? '#FF5252' : percentFulfilled < 80 ? '#FFD740' : '#69F0AE';

    let blash = (
      <div>
      <div style={{float: 'right'}}>
        <FlatButton onMouseUp={this._showConfirmationDialog} onTouchEnd={this._showConfirmationDialog} labelStyle={{color:'#FFC107'}} label='Decline' />
        <FlatButton labelStyle={{color:'#FFC107'}} onMouseUp={this._onAccept} onTouchEnd={this._onAccept} label='Accept' />
      </div>
      </div>
    );

    let subtitleText = `${project.numOfTestCasesFulfilled}/${project.numOfTestCases}`;
    let subtitle = (<div><div style={{float: 'left', paddingBottom: 16}}>{subtitleText}</div>{this.renderBuiltWith()}{blash}</div>)

    return (
      <Card key={this.props.key}>
        <CardTitle title={invitation.project.title} subtitle={subtitle} />
        <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Decline Invitation?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onDecline} />
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
          id
          title
          numOfTestCases
          numOfTestCasesFulfilled
          collaborators (first: 5) {
            edges {
              node {
                ${CollaboratorIcon.getFragment('collaborator')}
              }
            }
          }
          ${CollaboratorIcon.getFragment('project')},
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
