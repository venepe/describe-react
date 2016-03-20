'use strict';

import Relay from 'react-relay';

export default class DidIntroduceExampleSubscription extends Relay.Subscription {
  static fragments = {
    target: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`
      subscription {
        didIntroduceExample (input: $didIntroduceExample) {
          exampleEdge {
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
      type: 'RANGE_ADD',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'examples',
      edgeName: 'exampleEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      targetId: this.props.target.id,
    };
  }
}
