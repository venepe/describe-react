'use strict';

import Relay from 'react-relay';

export const CollaborationQueries = {
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
