'use strict';

import Relay from 'react-relay';

export default class ExampleRoute extends Relay.Route {
  static queries = {
    example: (Component) => Relay.QL`
      query {
        node(id: $exampleId) {
          ${Component.getFragment('example')},
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
    exampleId: {required: true},
  }

  static routeName = 'ExampleRoute';
}
