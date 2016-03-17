'use strict';

import Relay from 'react-relay';

export const MeQueries = {
  me: () => Relay.QL`
    query {
      node(id: $meId)
    }
  `
}
