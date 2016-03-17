'use strict';

import Relay from 'react-relay';

export const TestCaseQueries = {
  testCase: () => Relay.QL`
    query {
      node(id: $testCaseId)
    }
  `,
  project: () => Relay.QL`
    query {
      node(id: $projectId)
    }
  `,
}
