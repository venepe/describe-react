'use strict';

import Relay from 'react-relay';

class DeleteImageMutation extends Relay.Mutation {
  static fragments = {
    image: () => Relay.QL`
      fragment on Image {
        id
      }
    `,
    target: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{deleteImage}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteImagePayload {
        deletedImageId,
        target
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'images',
      deletedIDFieldName: 'deletedImageId',
    }];
  }
  getVariables() {
    return {
      id: this.props.image.id,
    };
  }
  getOptimisticResponse() {
    return {
      deletedImageId: this.props.image.id
    };
  }
}

module.exports = DeleteImageMutation;
