'use strict';

import Relay from 'react-relay';

export default class DidIntroduceCollaborationSubscription extends Relay.Subscription {
  static fragments = {
    me: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`subscription{didIntroduceCollaboration}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DidIntroduceCollaborationPayload {
        projectEdge
        me {
          collaborations
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'collaborations',
      edgeName: 'projectEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }];
  }
  getVariables() {
    return {
      targetId: this.props.me.id,
      title: this.props.title,
    };
  }
}

module.exports = DidIntroduceCollaborationSubscription;
