'use strict';

import Relay from 'react-relay';

export class DidDeleteCoverImageSubscription extends Relay.Subscription {
  static fragments = {
    coverImage: () => Relay.QL`
      fragment on File {
        id
      }
    `,
    target: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`
      subscription {
        didDeleteCoverImage (input: $didDeleteCoverImage) {
          deletedCoverImageId
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
      }`;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'coverImages',
      deletedIDFieldName: 'deletedCoverImageId',
    },
    {
      type: 'RANGE_ADD',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'coverImages',
      edgeName: 'coverImageEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }
  ];
  }
  getVariables() {
    return {
      id: this.props.coverImage.id,
      targetId: this.props.target.id
    };
  }
}
