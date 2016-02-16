'use strict';

import Relay from 'react-relay';

class DeleteCollaborationMutation extends Relay.Mutation {
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
  getMutation() {
    return Relay.QL`mutation{deleteCollaboration}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteCollaborationPayload {
        deletedCollaborationId,
        me { collaborations }
      }
    `;
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
    };
  }
  getOptimisticResponse() {
    return {
      deletedCollaborationId: this.props.collaboration.id
    };
  }
}

module.exports = DeleteCollaborationMutation;
