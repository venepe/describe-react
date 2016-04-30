'use strict';

import Relay from 'react-relay';

export default class DidIntroduceProjectSubscription extends Relay.Subscription {
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
        didIntroduceProject (input: $didIntroduceProject) {
          projectEdge {
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
              collaborators(first: 5) {
                edges {
                  node {
                    id
                    profile {
                      cover {
                        id
                        uri
                      }
                    }
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
      connectionName: 'projects',
      edgeName: 'projectEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      meId: this.props.me.id,
    };
  }
}
