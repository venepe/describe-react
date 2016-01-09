'use strict';

import Relay from 'react-relay';

class IntroduceTestCaseMutation extends Relay.Mutation {
  static fragments = {
    project: () => Relay.QL`
      fragment on Project {
        id
        numOfTestCases
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
          numOfTestCases
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
          '': 'prepend',
        }
      },
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          project: this.props.project.id,
        },
      }
    ];
  }
  getVariables() {
    return {
      targetId: this.props.project.id,
      it: this.props.it,
    };
  }
  getOptimisticResponse() {
    let numOfTestCases = this.props.project.numOfTestCases;
    numOfTestCases++;
    return {
      testCaseEdge: {
        node: {
          it: this.props.it,
        },
      },
      project: {
        id: this.props.project.id,
        numOfTestCases
      }
    };
  }
}

module.exports = IntroduceTestCaseMutation;
