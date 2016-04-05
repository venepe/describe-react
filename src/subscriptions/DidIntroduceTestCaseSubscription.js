'use strict';

import Relay from 'react-relay';

export default class DidIntroduceTestCaseSubscription extends Relay.Subscription {
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
        didIntroduceTestCase (input: $didIntroduceTestCase) {
          testCaseEdge {
            cursor
            node {
              id
              it
              isFulfilled
              fulfillments(first: 1) {
                edges {
                  node {
                    id
                    uri
                  }
                }
              }
              events(first: 1) {
                edges {
                  node {
                    id
                    it
                  }
                }
              }
            }
          }
          project {
            numOfTestCases
          },
        }
      }`;
  }
  getConfigs() {
    return [{
        type: 'RANGE_ADD',
        parentName: 'project',
        parentID: this.props.project.id,
        connectionName: 'testCases',
        edgeName: 'testCaseEdge',
        rangeBehaviors: {
          '': 'append',
        }
      }];
  }
  getVariables() {
    return {
      projectId: this.props.project.id,
    };
  }
}
