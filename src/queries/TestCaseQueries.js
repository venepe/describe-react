'use strict';

import Relay from 'react-relay';

const TestCaseQueries = {
  testCase: () => Relay.QL`
    query {
      node(id: $testCaseId)
    }
  `
}

export default TestCaseQueries;
