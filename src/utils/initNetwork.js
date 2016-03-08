'use strict';

import Relay from 'react-relay';
import IO from 'socket.io-client';
import { SMTIBaseUrl } from '../constants';
import { setIdentity } from './SMTIAnalytics';
import SMTIDefaultNetworkLayer from './SMTIDefaultNetworkLayer';
const socket = IO(SMTIBaseUrl);

export const initNetwork = (token = '') => {

  //Start SMTIAnalytics
  setIdentity(token);
  //End SMTIAnalytics

  Relay.injectNetworkLayer(new SMTIDefaultNetworkLayer(socket, token));

}
