'use strict';

import Relay from 'react-relay';

class DeleteTestCaseMutation extends Relay.Mutation {
  static fragments = {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{deleteTestCase}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteTestCasePayload {
        deletedTestCaseId,
        project { testCases }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.project.id,
      connectionName: 'testCases',
      deletedIDFieldName: 'deletedTestCaseId',
    }];
  }
  getVariables() {
    return {
      id: this.props.testCase.id,
    };
  }
  getOptimisticResponse() {
    return {
      deletedTestCaseId: this.props.testCase.id
    };
  }
}

module.exports = DeleteTestCaseMutation;
