'use strict';

import Relay from 'react-relay';

export class IntroduceProjectMutation extends Relay.Mutation {
  static fragments = {
    me: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{introduceProject}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceProjectPayload {
        projectEdge
        me {
          projects
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'projects',
      edgeName: 'projectEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      targetId: this.props.me.id,
      title: this.props.title,
    };
  }
  getOptimisticResponse() {
    return {
      projectEdge: {
        node: {
          title: this.props.title,
          numOfTestCases: 0,
          numOfTestCasesFulfilled: 0,
        },
      },
    };
  }
}
