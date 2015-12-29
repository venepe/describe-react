'use strict';

import Relay from 'react-relay';

const CoverImageQueries = {
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

export default CoverImageQueries;
