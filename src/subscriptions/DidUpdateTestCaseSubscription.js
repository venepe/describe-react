'use strict';

import Relay from 'react-relay';

export default class DidUpdateTestCaseSubscription extends Relay.Subscription {
  static fragments = {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
      }
    `,
  };
  getSubscription() {
    return Relay.QL`
      subscription {
        didUpdateTestCase (input: $didUpdateTestCase) {
          testCase {
            id
            it
          }
        }
      }`;
  }
  getConfigs() {
    return [];
  }
  getVariables() {
    return {
      id: this.props.testCase.id,
    };
  }
}
