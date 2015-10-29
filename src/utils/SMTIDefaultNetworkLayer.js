'use strict';

import Relay from 'react-relay';
import SMTIConstants, { SMTIGraphQLUrl } from '../constants';

function init(token) {
  token = token || '';

  var SMTIDefaultNetworkLayer = new Relay.DefaultNetworkLayer(SMTIGraphQLUrl, {
    headers: {
      'x-access-token': token
    }
  }
  )

  Relay.injectNetworkLayer(SMTIDefaultNetworkLayer);
}

module.exports.init = init;
