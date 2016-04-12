'use strict';

import Relay from 'react-relay';

export default class UpdateFulfillmentMutation extends Relay.Mutation {
  static fragments = {
    fulfillment: () => Relay.QL`
      fragment on Fulfillment {
        id
        status
        file {
          id
          uri
        }
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
    return Relay.QL`mutation{updateFulfillment}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateFulfillmentPayload {
        fulfillment {
          id
          status
          reason
          file {
            id
            uri
          }
        }
        fulfillmentEventEdge {
          cursor
          node {
            id
            status
            reason
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
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        fulfillment: this.props.fulfillment.id,
      }
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
    },
    {
      type: 'RANGE_ADD',
      parentName: 'fulfillment',
      parentID: this.props.fulfillment.id,
      connectionName: 'events',
      edgeName: 'fulfillmentEventEdge',
      rangeBehaviors: {
        '': 'append',
      }
    }
  ];
  }
  getVariables() {
    return {
      id: this.props.fulfillment.id,
      testCaseId: this.props.testCase.id,
      status: this.props.status,
      reason: this.props.reason,
    };
  }
  getOptimisticResponse() {
    let status = this.props.status || this.props.fulfillment.status;
    let isFulfilled = false;
    let numOfTestCasesFulfilled = this.props.project.numOfTestCasesFulfilled;
    if (this.props.testCase.fulfillments.edges.length > 1) {
      isFulfilled = true;
    } else {
      numOfTestCasesFulfilled--;
    }
    return {
      fulfillment: {
        id: this.props.fulfillment.id,
        reason: this.props.reason,
        file: {
          id: this.props.fulfillment.file.id,
          uri: this.props.fulfillment.file.uri
        },
        status
      },
      fulfillmentEventEdge: {
        node: {
          reason: this.props.reason,
          status
        }
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
