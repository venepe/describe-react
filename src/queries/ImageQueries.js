'use strict';

import Relay from 'react-relay';

const ImageQueries = {
  image: () => Relay.QL`
    query {
      node(id: $imageId)
    }
  `
}

export default ImageQueries;
