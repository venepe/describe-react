'use strict';

import Relay from 'react-relay';

export class IntroduceCollaboratorMutation extends Relay.Mutation {
  static fragments = {
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{introduceCollaborator}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceCollaboratorPayload {
        collaboratorEdge {
          cursor
          node {
            id
            name
          }
        }
        project {
          id
        },
      }
    `;
  }
  getConfigs() {
    return [{
        type: 'RANGE_ADD',
        parentName: 'project',
        parentID: this.props.project.id,
        connectionName: 'collaborators',
        edgeName: 'collaboratorEdge',
        rangeBehaviors: {
          '': 'append',
        }
      }];
  }
  getVariables() {
    return {
      projectId: this.props.project.id,
      email: this.props.email,
    };
  }
  getOptimisticResponse() {
    return {
      collaboratorEdge: {
        node: {},
      },
      project: {
        id: this.props.project.id,
      }
    };
  }
}
