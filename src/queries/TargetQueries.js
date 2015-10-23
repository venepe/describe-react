'use strict';

import Relay from 'react-relay';

const TargetQueries = {
  target: () => Relay.QL`
    query {
      node(id: $targetId)
    }
  `
}

export default TargetQueries;
