'use strict';

import Relay from 'react-relay';

export const CoverImageQueries = {
  coverImage: () => Relay.QL`
    query {
      node(id: $coverImageId)
    }
  `,
  target: () => Relay.QL`
    query {
      node(id: $targetId)
    }
  `
}
