'use strict';

import Relay from 'react-relay';

const PaperQueries = {
  paper: () => Relay.QL`
    query {
      node(id: $paperId)
    }
  `
}

export default PaperQueries;
