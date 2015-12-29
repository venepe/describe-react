'use strict';

import Relay from 'react-relay';

class CoverImageRoute extends Relay.Route {
  static queries = {
    coverImage: (Component) => Relay.QL`
      query {
        node(id: $coverImageId) {
          ${Component.getFragment('coverImage')},
        },
      }
    `,
    target: (Component) => Relay.QL`
      query {
        node(id: $targetId) {
          ${Component.getFragment('target')},
        },
      }
    `,
  };

  static paramDefinitions = {
    coverImageId: {required: true},
  }

  static routeName = 'CoverImageRoute';
}

module.exports = CoverImageRoute;
