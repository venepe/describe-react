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
  `,
  project: () => Relay.QL`
    query {
      node(id: $projectId)
    }
  `
}

export default FulfillmentQueries;
