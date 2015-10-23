'use strict';

import Relay from 'react-relay';

class FulfillProjectMutation extends Relay.Mutation {
  static fragments = {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{fulfillProject}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on FulfillProjectPayload {
        fulfillmentEdge
        testCase {
          fulfillments
        },
        me {
          projects
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
    },
    {
      type: 'RANGE_ADD',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'projects',
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
  getVariables() {
    return {
      testCaseId: this.props.testCase.id,
      title: this.props.title,
    };
  }
  getOptimisticResponse() {
    return {
      fulfillmentEdge: {
        node: {
          title: this.props.title,
        },
      },
    };
  }
}

module.exports = FulfillProjectMutation;
