'use strict';

import Relay from 'react-relay';

class ImageRoute extends Relay.Route {
  static queries = {
    image: (Component) => Relay.QL`
      query {
        node(id: $imageId) {
          ${Component.getFragment('image')},
        },
      }
    `,
  };

  static paramDefinitions = {
    imageId: {required: true},
  }

  static routeName = 'ImageRoute';
}

module.exports = ImageRoute;
