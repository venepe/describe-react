'use strict';

import Relay from 'react-relay';

export default class DidIntroduceFulfillmentSubscription extends Relay.Subscription {
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
        didIntroduceFulfillment (input: $didIntroduceFulfillment) {
          fulfillmentEdge {
            cursor
            node {
              id
              uri
            }
          }
          testCase {
            id
            isFulfilled,
          },
          project {
            id
            numOfTestCasesFulfilled
          },
        }
      }`;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'testCase',
      parentID: this.props.testCase.id,
      connectionName: 'fulfillments',
      edgeName: 'fulfillmentEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      testCaseId: this.props.testCase.id,
    };
  }
}
