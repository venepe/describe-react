'use strict';

import Relay from 'react-relay';

class UpdateTestCaseMutation extends Relay.Mutation {
  static fragments = {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateTestCase}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTestCasePayload {
        testCase {
          it,
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        testCase: this.props.testCase.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.testCase.id,
      it: this.props.it,
    };
  }
  getOptimisticResponse() {
    return {
      testCase: {
        id: this.props.testCase.id,
        it: this.props.it,
      },
    };
  }
}

module.exports = UpdateTestCaseMutation;
