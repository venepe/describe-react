'use strict';

import Relay from 'react-relay';

export const FileQueries = {
  file: () => Relay.QL`
    query {
      node(id: $fileId)
    }
  `
}
