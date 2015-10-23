'use strict';

import Relay from 'react-relay';

const ProjectQueries = {
  project: () => Relay.QL`
    query {
      node(id: $projectId)
    }
  `
}

export default ProjectQueries;
