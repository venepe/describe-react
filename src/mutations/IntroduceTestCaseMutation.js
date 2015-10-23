'use strict';

import Relay from 'react-relay';

class IntroduceTestCaseMutation extends Relay.Mutation {
  static fragments = {
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{introduceTestCase}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceTestCasePayload {
        testCaseEdge
        project {
          testCases
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.project.id,
      connectionName: 'testCases',
      edgeName: 'testCaseEdge',
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
      targetId: this.props.project.id,
      it: this.props.it,
    };
  }
  getOptimisticResponse() {
    return {
      testCaseEdge: {
        node: {
          it: this.props.it,
        },
      },
    };
  }
}

module.exports = IntroduceTestCaseMutation;
