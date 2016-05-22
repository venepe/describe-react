'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Card, CardHeader } from 'material-ui';
import ConfirmationDialog from '../ConfirmationDialog';
import DeleteButton from '../DeleteButton';
import styles from './InviteeListCellView.css';

import { DeleteInviteeMutation } from '../../mutations';
import { registerDidDeleteInvitee } from '../../stores/SubscriptionStore';
import { DidDeleteInviteeSubscription } from '../../subscriptions';

class InviteeListCellView extends Component {
  constructor(props) {
    super(props);
    this._onDelete = this._onDelete.bind(this);
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this._showConfirmationDialog = this._showConfirmationDialog.bind(this);
    this.state = {
      showConfirmationDialog: false
    };
  }

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

  _onDelete() {
    this._dismissConfirmationDialog();
    Relay.Store.commitUpdate(
      new DeleteInviteeMutation({invitee: this.props.invitee, project: this.props.project})
    );
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.invitee && this.props.project) {
      let invitee = this.props.invitee;
      let project = this.props.project;
      let inviteeId = invitee.id;
      let projectId = project.id;

      registerDidDeleteInvitee({inviteeId, projectId}, () => {
        return Relay.Store.subscribe(
          new DidDeleteInviteeSubscription({invitee, project})
        );
      });
    }
  }

  render() {
    let invitee = this.props.invitee;
    let profile = invitee.profile;

    if (this.props.invitee.role !== 'AUTHOR') {
      let marginRight = 30;
      return (
          <Card>
            <DeleteButton onClick={this._showConfirmationDialog} />
            <CardHeader style={{marginRight}} title={profile.name} subtitle={invitee.role} avatar={profile.cover.uri} className="clickable" onClick={() => this.props.onClick(invitee)}>
            </CardHeader>
            <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Delete Invitation?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onDelete} />
          </Card>
      );
    } else {
      return (
          <Card>
            <CardHeader title={profile.name} subtitle={invitee.role} avatar={profile.cover.uri} className="clickable" onClick={() => this.props.onClick(invitee)}>
            </CardHeader>
          </Card>
      );
    }
  }
}

export default Relay.createContainer(InviteeListCellView, {
  fragments: {
    invitee: () => Relay.QL`
      fragment on Invitee {
        id
        role
        profile {
          id
          name
          cover {
            id
            uri
          }
        }
        ${DeleteInviteeMutation.getFragment('invitee')},
        ${DidDeleteInviteeSubscription.getFragment('invitee')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${DeleteInviteeMutation.getFragment('project')},
        ${DidDeleteInviteeSubscription.getFragment('project')},
      }
    `,
  },
});
