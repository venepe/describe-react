'use strict';

import Relay from 'react-relay';

class IntroduceImageMutation extends Relay.Mutation {
  static fragments = {
    target: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{introduceImage}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceImagePayload {
        imageEdge
        target
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'images',
      edgeName: 'imageEdge',
      rangeBehaviors: {
        // When the ships connection is not under the influence
        // of any call, append the ship to the end of the connection
        '': 'prepend',
        // Prepend the ship, wherever the connection is sorted by age
        // 'orderby:newest': 'prepend',
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
      imageEdge: {
        node: {
          uri: this.props.uri,
        },
      },
    };
  }
}

module.exports = IntroduceImageMutation;
