'use strict';

import Relay from 'react-relay';

const ExampleQueries = {
  example: () => Relay.QL`
    query {
      node(id: $exampleId)
    }
  `,
  target: () => Relay.QL`
    query {
      node(id: $targetId)
    }
  `
}

export default ExampleQueries;
