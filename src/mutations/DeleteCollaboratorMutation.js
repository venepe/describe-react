'use strict';

import Relay from 'react-relay';

class DeleteCollaboratorMutation extends Relay.Mutation {
  static fragments = {
    collaborator: () => Relay.QL`
      fragment on User {
        id
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{deleteCollaborator}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteCollaboratorPayload {
        deletedCollaboratorId
        project
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.project.id,
      connectionName: 'collaborators',
      deletedIDFieldName: 'deletedCollaboratorId',
    }
  ];
  }
  getVariables() {
    return {
      id: this.props.collaborator.id,
      projectId: this.props.project.id
    };
  }
  getOptimisticResponse() {
    return {
      deletedCollaboratorId: this.props.collaborator.id,
      project: {
        id: this.props.project.id
      }
    };
  }
}

module.exports = DeleteCollaboratorMutation;
