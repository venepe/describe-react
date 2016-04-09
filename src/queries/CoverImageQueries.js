'use strict';

import Relay from 'react-relay';

export const CoverImageQueries = {
  coverImage: () => Relay.QL`
    query {
      node(id: $coverImageId)
    }
  `,
  user: () => Relay.QL`
    query {
      node(id: $userId)
    }
  `
}
