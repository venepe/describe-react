'use strict';

import Relay from 'react-relay';

const CollaborationQueries = {
  collaboration: () => Relay.QL`
    query {
      node(id: $collaborationId)
    }
  `,
  me: () => Relay.QL`
    query {
      node(id: $meId)
    }
  `
}

export default CollaborationQueries;
