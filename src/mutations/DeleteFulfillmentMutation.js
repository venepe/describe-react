'use strict';

import Relay from 'react-relay';

class DeleteFulfillmentMutation extends Relay.Mutation {
  static fragments = {
    fulfillment: () => Relay.QL`
      fragment on File {
        id
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        fulfillments(first: 2) {
          edges
        }
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{deleteFulfillment}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteFulfillmentPayload {
        deletedFulfillmentId,
        testCase
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'testCase',
      parentID: this.props.testCase.id,
      connectionName: 'fulfillments',
      deletedIDFieldName: 'deletedFulfillmentId',
    },
    {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        testCase: this.props.testCase.id,
      }
    }
  ];
  }
  getVariables() {
    return {
      id: this.props.fulfillment.id,
      testCaseId: this.props.testCase.id
    };
  }
  getOptimisticResponse() {
    let isFulfilled = false;
    if (this.props.testCase.fulfillments.edges.length > 1) {
      isFulfilled = true;
    }
    return {
      deletedImageId: this.props.fulfillment.id,
      testCase: {
        id: this.props.testCase.id,
        isFulfilled
      }
    };
  }
}

module.exports = DeleteFulfillmentMutation;
