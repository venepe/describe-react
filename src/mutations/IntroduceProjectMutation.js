'use strict';

import Relay from 'react-relay';

class IntroduceProjectMutation extends Relay.Mutation {
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
      targetId: this.props.me.id,
      title: this.props.title,
    };
  }
  getOptimisticResponse() {
    return {
      projectEdge: {
        node: {
          title: this.props.title,
        },
      },
    };
  }
}

module.exports = IntroduceProjectMutation;