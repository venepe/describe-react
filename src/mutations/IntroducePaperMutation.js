'use strict';

import Relay from 'react-relay';

class IntroducePaperMutation extends Relay.Mutation {
  static fragments = {
    target: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{introducePaper}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on IntroducePaperPayload {
        paperEdge
        target
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'papers',
      edgeName: 'paperEdge',
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
      targetId: this.props.target.id,
      text: this.props.text
    };
  }

  getOptimisticResponse() {
    return {
      paperEdge: {
        node: {
          text: this.props.text,
        },
      },
    };
  }
}

module.exports = IntroducePaperMutation;
