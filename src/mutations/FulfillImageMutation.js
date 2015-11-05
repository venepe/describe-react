'use strict';

import Relay from 'react-relay';

class FulfillImageMutation extends Relay.Mutation {
  static fragments = {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{fulfillImage}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on FulfillImagePayload {
        fulfillmentEdge
        testCase {
          fulfillments
        },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'testCase',
      parentID: this.props.testCase.id,
      connectionName: 'fulfillments',
      edgeName: 'fulfillmentEdge',
      rangeBehaviors: {
        // When the ships connection is not under the influence
        // of any call, append the ship to the end of the connection
        '': 'prepend',
        // Prepend the ship, wherever the connection is sorted by age
        // 'orderby:newest': 'prepend',
      },
    }];
  }

  getFiles() {
    return [
      this.props.uri
    ]
  }

  getVariables() {
    return {
      testCaseId: this.props.testCase.id,
      uri: this.props.uri,
    };
  }

  getOptimisticResponse() {
    return {
      fulfillmentEdge: {
        node: {
          uri: this.props.uri,
        },
      },
    };
  }
}

module.exports = FulfillImageMutation;
