'use strict';

import Relay from 'react-relay';

class IntroduceCoverImageMutation extends Relay.Mutation {
  static fragments = {
    target: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{introduceCoverImage}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceCoverImagePayload {
        coverImageEdge {
          node {
            id
            uri
          }
        }
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
      connectionName: 'coverImages',
      edgeName: 'coverImageEdge',
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
      coverImageEdge: {
        node: {},
      },
    };
  }
}

module.exports = IntroduceCoverImageMutation;
