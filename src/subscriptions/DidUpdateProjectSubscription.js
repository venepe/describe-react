'use strict';

import Relay from 'react-relay';

export class DidUpdateProjectSubscription extends Relay.Subscription {
  static fragments = {
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`
      subscription {
        didUpdateProject (input: $didUpdateProject) {
          project {
            id
            title
          }
        }
      }`;
  }
  getConfigs() {
    return [];
  }
  getVariables() {
    return {
      id: this.props.project.id,
    };
  }
}
