'use strict';

import Relay from 'react-relay';

export default class DidUpdateProjectSubscription extends Relay.Subscription {
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
        didUpdateProject (input: $didUpdateProject) {
          project {
            id
            title
            numOfTestCases
            numOfTestCasesFulfilled
          }
          projectEventEdge {
            node {
              id
              title
            }
          }
        }
      }`;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.project.id,
      connectionName: 'events',
      edgeName: 'projectEventEdge',
      rangeBehaviors: {
        '': 'prepend',
      }
    }];
  }
  getVariables() {
    return {
      id: this.props.project.id,
    };
  }
}
