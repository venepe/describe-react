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

  var SETINetwork = {
    sendMutation(request) {
      return SMTIDefaultNetworkLayer.sendMutation(request);
    },
    sendQueries(request) {
      console.log('get thing');
      return SMTIDefaultNetworkLayer.sendQueries(request);
    },
    supports() {
      return false;
    }
  }

  Relay.injectNetworkLayer(SETINetwork);
}

module.exports.init = init;
