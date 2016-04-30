'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaboratorIcon.css';

import { registerDidDeleteCollaborator } from '../../stores/SubscriptionStore';
import { DidDeleteCollaboratorSubscription } from '../../subscriptions';

class CollaboratorIcon extends Component {
  constructor(props) {
    super(props);
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
    let profile = collaborator.profile || {};
    let cover = profile.cover || {};

    return(
      <img style={{float: 'left', marginLeft: 10, borderRadius: '50%',}} height={20} width={20} src={cover.uri} />
    );
  }
}

export default Relay.createContainer(CollaboratorIcon, {
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
        ${DidDeleteCollaboratorSubscription.getFragment('collaborator')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${DidDeleteCollaboratorSubscription.getFragment('project')},
      }
    `,
  },
});
