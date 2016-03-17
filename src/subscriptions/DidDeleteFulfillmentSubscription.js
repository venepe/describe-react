'use strict';

import Relay from 'react-relay';

export class DidDeleteFulfillmentSubscription extends Relay.Subscription {
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
        didDeleteFulfillment (input: $didDeleteFulfillment) {
          deletedFulfillmentId
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
      deletedIDFieldName: 'deletedFulfillmentId',
    }];
  }
  getVariables() {
    return {
      id: this.props.fulfillment.id,
      testCaseId: this.props.testCase.id
    };
  }
}
