'use strict';

import Relay from 'react-relay';

class DeleteCoverImageMutation extends Relay.Mutation {
  static fragments = {
    coverImage: () => Relay.QL`
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
    return Relay.QL`mutation{deleteCoverImage}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteCoverImagePayload {
        deletedCoverImageId,
        target
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'coverImages',
      deletedIDFieldName: 'deletedCoverImageId',
    }];
  }
  getVariables() {
    return {
      id: this.props.coverImage.id,
    };
  }
  getOptimisticResponse() {
    return {
      deletedCoverImageId: this.props.coverImage.id
    };
  }
}

module.exports = DeleteCoverImageMutation;
