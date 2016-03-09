'use strict';

import Relay from 'react-relay';

export default class DidIntroduceCollaboratorSubscription extends Relay.Subscription {
  static fragments = {
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`
      subscription {
        didIntroduceCollaborator (input: $didIntroduceCollaborator) {
          collaboratorEdge {
            node {
              id
              name
            }
          }
          project {
            id
          },
        }
      }`;
  }
  getConfigs() {
    return [{
        type: 'RANGE_ADD',
        parentName: 'project',
        parentID: this.props.project.id,
        connectionName: 'collaborators',
        edgeName: 'collaboratorEdge',
        rangeBehaviors: {
          '': 'prepend',
        }
      }];
  }
  getVariables() {
    return {
      projectId: this.props.project.id,
    };
  }
}
