'use strict';

import Relay from 'react-relay';

class IntroduceExampleMutation extends Relay.Mutation {
  static fragments = {
    target: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{introduceExample}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceExamplePayload {
        exampleEdge
        target {
          id
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'examples',
      edgeName: 'exampleEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }];
  }

  getFiles() {
    return [
      this.props.uri
    ]
  }

  getVariables() {
    return {
      targetId: this.props.target.id,
      uri: this.props.uri
    };
  }

  getOptimisticResponse() {
    return {
      exampleEdge: {
        node: {},
      },
    };
  }
}

module.exports = IntroduceExampleMutation;
