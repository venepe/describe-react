'use strict';

import Relay from 'react-relay';

const ProjectQueries = {
  project: () => Relay.QL`
    query {
      node(id: $projectId)
    }
  `,
  me: () => Relay.QL`
    query {
      node(id: $meId)
    }
  `
}

export default ProjectQueries;
