'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Card, CardHeader } from 'material-ui';
import ConfirmationDialog from '../ConfirmationDialog';
import DeleteButton from '../DeleteButton';
import styles from './CollaboratorListCellView.css';

import { DeleteCollaboratorMutation } from '../../mutations';
import { registerDidDeleteCollaborator } from '../../stores/SubscriptionStore';
import { DidDeleteCollaboratorSubscription } from '../../subscriptions';

class CollaboratorListCellView extends Component {
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
      new DeleteCollaboratorMutation({collaborator: this.props.collaborator, project: this.props.project})
    );
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.collaborator && this.props.project) {
      let collaborator = this.props.collaborator;
      let project = this.props.project;
      let collaboratorId = collaborator.id;
      let projectId = project.id;

      registerDidDeleteCollaborator({collaboratorId, projectId}, () => {
        return Relay.Store.subscribe(
          new DidDeleteCollaboratorSubscription({collaborator, project})
        );
      });
    }
  }

  render() {
    let collaborator = this.props.collaborator;
    let profile = collaborator.profile;

    if (this.props.collaborator.role !== 'AUTHOR') {
      let marginRight = 30;
      return (
          <Card>
            <DeleteButton onClick={this._showConfirmationDialog} />
            <CardHeader style={{marginRight}} title={profile.name} subtitle={collaborator.role} avatar={profile.cover.uri} className="clickable" onClick={() => this.props.onClick(collaborator)}>
            </CardHeader>
            <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Delete Collaborator?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onDelete} />
          </Card>
      );
    } else {
      return (
          <Card>
            <CardHeader title={profile.name} subtitle={collaborator.role} avatar={profile.cover.uri} className="clickable" onClick={() => this.props.onClick(collaborator)}>
            </CardHeader>
          </Card>
      );
    }
  }
}

export default Relay.createContainer(CollaboratorListCellView, {
  fragments: {
    collaborator: () => Relay.QL`
      fragment on Collaborator {
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
        ${DeleteCollaboratorMutation.getFragment('collaborator')},
        ${DidDeleteCollaboratorSubscription.getFragment('collaborator')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${DeleteCollaboratorMutation.getFragment('project')},
        ${DidDeleteCollaboratorSubscription.getFragment('project')},
      }
    `,
  },
});
