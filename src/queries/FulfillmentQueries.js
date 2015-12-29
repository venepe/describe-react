'use strict';

import Relay from 'react-relay';

const FulfillmentQueries = {
  fulfillment: () => Relay.QL`
    query {
      node(id: $fulfillmentId)
    }
  `,
  testCase: () => Relay.QL`
    query {
      node(id: $testCaseId)
    }
  `
}

export default FulfillmentQueries;
