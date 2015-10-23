'use strict';

import Relay from 'react-relay';

const MeQueries = {
  me: () => Relay.QL`
    query {
      node(id: $meId)
    }
  `
}

export default MeQueries;
