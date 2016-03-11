'use strict';

import Relay from 'react-relay';

export default class DidDeleteCollaborationSubscription extends Relay.Subscription {
  static fragments = {
    collaboration: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`
      subscription {
        didDeleteCollaboration (input: $didDeleteCollaboration) {
          deletedCollaborationId,
          me {
            id
          },
        }
      }`;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'collaborations',
      deletedIDFieldName: 'deletedCollaborationId',
      }];
  }
  getVariables() {
    return {
      id: this.props.collaboration.id,
      meId: this.props.me.id,
    };
  }
}
