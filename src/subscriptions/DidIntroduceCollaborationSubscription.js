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
    return Relay.QL`
      subscription {
        didIntroduceCollaboration (input: $didIntroduceCollaboration) {
          collaborationEdge {
            node {
              id
              title
              numOfTestCases
              numOfTestCasesFulfilled
              testCases(first: 1) {
                edges {
                  node {
                    id
                    it
                  }
                }
              }
            }
          }
          me {
            id
          },
        }
      }`;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'collaborations',
      edgeName: 'collaborationEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }];
  }
  getVariables() {
    return {
      meId: this.props.me.id,
    };
  }
}