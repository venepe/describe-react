'use strict';

import Relay from 'react-relay';

export const UserQueries = {
  user: () => Relay.QL`
    query {
      node(id: $userId)
    }
  `
}
