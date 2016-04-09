'use strict';

import Relay from 'react-relay';

export default class DidUpdateTestCaseSubscription extends Relay.Subscription {
  static fragments = {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`
      subscription {
        didUpdateTestCase (input: $didUpdateTestCase) {
          testCase {
            id
            it
            isFulfilled
          }
          testCaseEventEdge {
            node {
              id
              it
            }
          }
        }
      }`;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'testCase',
      parentID: this.props.testCase.id,
      connectionName: 'events',
      edgeName: 'testCaseEventEdge',
      rangeBehaviors: {
        '': 'append',
      }
    }];
  }
  getVariables() {
    return {
      id: this.props.testCase.id,
    };
  }
}
