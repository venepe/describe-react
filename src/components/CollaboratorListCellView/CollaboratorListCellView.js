'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Card, CardHeader, IconButton, FontIcon, Styles } from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import styles from './CollaboratorListCellView.css';

import { DeleteCollaboratorMutation } from '../../mutations';
import { registerDidDeleteCollaborator } from '../../stores/SubscriptionStore';
import { DidDeleteCollaboratorSubscription } from '../../subscriptions';

class CollaboratorListCellView extends Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
  }

  onDelete(e) {
    console.log(e);
    e.preventDefault();
    e.stopPropagation();
    return;
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

  renderDeleteButton() {
    if (this.props.collaborator.role !== 'AUTHOR') {
      return (
        <IconButton onMouseUp={this.onDelete} onTouchEnd={this.onDelete} style={{width: '24px', padding: '0px', float: 'right'}}><FontIcon className="material-icons" color={Styles.Colors.grey600}>delete</FontIcon></IconButton>
      )
    } else {
      return;
    }
  }


  render() {
    let collaborator = this.props.collaborator;
    let profile = collaborator.profile;

    return (
      <Card className="clickable" onClick={() => this.props.onClick(collaborator)}>
        <CardHeader title={profile.name} subtitle={collaborator.role} avatar={profile.cover.uri}>
          {this.renderDeleteButton()}
        </CardHeader>
      </Card>
    );
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
