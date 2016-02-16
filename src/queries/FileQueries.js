'use strict';

import Relay from 'react-relay';

const FileQueries = {
  file: () => Relay.QL`
    query {
      node(id: $fileId)
    }
  `
}

export default FileQueries;
