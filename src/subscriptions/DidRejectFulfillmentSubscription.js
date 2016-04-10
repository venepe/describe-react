'use strict';

import Relay from 'react-relay';

export default class DidRejectFulfillmentSubscription extends Relay.Subscription {
  static fragments = {
    fulfillment: () => Relay.QL`
      fragment on File {
        id
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`
      subscription {
        didRejectFulfillment (input: $didRejectFulfillment) {
          rejectedFulfillmentId
          rejectionEdge {
            cursor
            node {
              id
              file {
                id
                uri
              }
            }
          }
          testCase {
            id
            isFulfilled
          }
          project {
            id
            numOfTestCasesFulfilled
          }
        }
      }`;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'testCase',
      parentID: this.props.testCase.id,
      connectionName: 'fulfillments',
      deletedIDFieldName: 'rejectedFulfillmentId',
    },
    {
      type: 'RANGE_ADD',
      parentName: 'testCase',
      parentID: this.props.testCase.id,
      connectionName: 'rejections',
      edgeName: 'rejectionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.fulfillment.id,
      testCaseId: this.props.testCase.id
    };
  }
}
