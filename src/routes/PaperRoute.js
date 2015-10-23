'use strict';

import Relay from 'react-relay';

class PaperRoute extends Relay.Route {
  static queries = {
    paper: (Component) => Relay.QL`
      query {
        node(id: $paperId) {
          ${Component.getFragment('paper')},
        },
      }
    `,
  };

  static paramDefinitions = {
    paperId: {required: true},
  }

  static routeName = 'PaperRoute';
}

module.exports = PaperRoute;
