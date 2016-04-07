'use strict';

import Relay from 'react-relay';

export default class RejectFulfillmentMutation extends Relay.Mutation {
  static fragments = {
    fulfillment: () => Relay.QL`
      fragment on File {
        id
        uri
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
    project: () => Relay.QL`
      fragment on Project {
        id
        numOfTestCasesFulfilled
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{rejectFulfillment}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RejectFulfillmentPayload {
        rejectedFulfillmentId
        rejectionEdge {
          cursor
          node {
            id
            uri
          }
        }
        testCase
        project {
          numOfTestCasesFulfilled
        }
      }
    `;
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
  getVariables() {
    return {
      id: this.props.fulfillment.id,
      testCaseId: this.props.testCase.id
    };
  }
  getOptimisticResponse() {
    let isFulfilled = false;
    let numOfTestCasesFulfilled = this.props.project.numOfTestCasesFulfilled;
    if (this.props.testCase.fulfillments.edges.length > 1) {
      isFulfilled = true;
    } else {
      numOfTestCasesFulfilled--;
    }
    return {
      rejectedFulfillmentId: this.props.fulfillment.id,
      rejectionEdge: {
        node: {
          id: this.props.fulfillment.id,
          uri: this.props.fulfillment.uri
        },
      },
      testCase: {
        id: this.props.testCase.id,
        isFulfilled
      },
      project: {
        id: this.props.project.id,
        numOfTestCasesFulfilled
      }
    };
  }
}
