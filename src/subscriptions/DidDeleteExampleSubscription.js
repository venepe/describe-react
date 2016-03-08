'use strict';

import Relay from 'react-relay';

export default class DidDeleteExampleSubscription extends Relay.Subscription {
  static fragments = {
    example: () => Relay.QL`
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
        didDeleteExample (input: $didDeleteExample) {
          deletedExampleId
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
      connectionName: 'examples',
      deletedIDFieldName: 'deletedExampleId',
    }];
  }
  getVariables() {
    return {
      id: this.props.example.id,
      targetId: this.props.target.id
    };
  }
}
