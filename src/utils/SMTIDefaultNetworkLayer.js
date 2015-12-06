'use strict';

import Relay from 'react-relay';
import SMTIConstants, { SMTIGraphQLUrl } from '../constants';
import {setIdentity} from './SMTIAnalytics';

function init(token) {
  token = token || '';

  //Start SMTIAnalytics
  setIdentity(token);
  //End SMTIAnalytics

  var SMTIDefaultNetworkLayer = new Relay.DefaultNetworkLayer(SMTIGraphQLUrl, {
    headers: {
      'x-smti-authorization': token
    }
  }
  )

  Relay.injectNetworkLayer(SMTIDefaultNetworkLayer);
}

module.exports.init = init;
