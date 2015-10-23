'use strict';

import Relay from 'react-relay';

const UserQueries = {
  user: () => Relay.QL`
    query {
      node(id: $userId)
    }
  `
}

export default UserQueries;
