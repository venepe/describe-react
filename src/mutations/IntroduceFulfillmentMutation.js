'use strict';

import Relay from 'react-relay';

export default class IntroduceFulfillmentMutation extends Relay.Mutation {
  static fragments = {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        numOfTestCasesFulfilled
      }
    `
  };

  getMutation() {
    return Relay.QL`mutation{introduceFulfillment}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceFulfillmentPayload {
        fulfillmentEdge {
          cursor
          node {
            id
            status
            file {
              id
              uri
            }
          }
        }
        testCase {
          id
          isFulfilled,
          fulfillments
        },
        project {
          numOfTestCasesFulfilled
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
        '': 'prepend',
      },
    },
    {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        testCase: this.props.testCase.id,
      }
    },
    {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        project: this.props.project.id,
      }
    }
  ];
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
    let numOfTestCasesFulfilled = this.props.project.numOfTestCasesFulfilled;
    if (this.props.testCase.isFulfilled === false) {
      numOfTestCasesFulfilled++;
    }
    return {
      fulfillmentEdge: {
        node: {
          status: 'SUBMITTED',
          file: {
            uri: ''
          }
        },
      },
      testCase: {
        id: this.props.testCase.id,
        isFulfilled: true
      },
      project: {
        id: this.props.project.id,
        numOfTestCasesFulfilled
      }
    };
  }
}
