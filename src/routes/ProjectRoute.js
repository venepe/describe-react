'use strict';

import Relay from 'react-relay';

class ProjectRoute extends Relay.Route {
  static queries = {
    project: (Component) => Relay.QL`
      query {
        node(id: $projectId) {
          ${Component.getFragment('project')},
        },
      }
    `,
    me: (Component) => Relay.QL`
      query {
        node(id: $meId) {
          ${Component.getFragment('me')},
        },
      }
    `,
  };

  static paramDefinitions = {
    projectId: {required: true},
  }

  static routeName = 'ProjectRoute';
}

module.exports = ProjectRoute;
