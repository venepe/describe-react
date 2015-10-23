'use strict';

import Relay from 'react-relay';

const SearchProjectsQueries = {
  projects: () => Relay.QL`
    query {
      searchProjects(query: $query)
    }
  `
}

export default SearchProjectsQueries;
