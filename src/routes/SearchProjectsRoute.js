'use strict';

import Relay from 'react-relay';

class SearchProjectsRoute extends Relay.Route {
  static queries = {
    projects: (Component) => Relay.QL`
      query {
        searchProjects(query: $query) {
          ${Component.getFragment('projects')},
        },
      }
    `,
  };

  static paramDefinitions = {
    query: {required: true},
  }

  static routeName = 'SearchProjectsRoute';
}

module.exports = SearchProjectsRoute;
