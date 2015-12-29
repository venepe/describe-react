'use strict';

import Relay from 'react-relay';

class FulfillmentRoute extends Relay.Route {
  static queries = {
    fulfillment: (Component) => Relay.QL`
      query {
        node(id: $fulfillmentId) {
          ${Component.getFragment('fulfillment')},
        },
      }
    `,
    testCase: (Component) => Relay.QL`
      query {
        node(id: $testCaseId) {
          ${Component.getFragment('testCase')},
        },
      }
    `,
  };

  static paramDefinitions = {
    fulfillmentId: {required: true},
  }

  static routeName = 'FulfillmentRoute';
}

module.exports = FulfillmentRoute;
