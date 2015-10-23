import createHashHistory from 'history/lib/createHashHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {Router} from 'react-router';
import ReactRouterRelay from 'react-router-relay';
import SMTIDefaultNetworkLayer from './utils/SMTIDefaultNetworkLayer';

import routes from './routes';

SMTIDefaultNetworkLayer.init();

const history = createHashHistory({queryKey: false});

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(
  <Router
    createElement={ReactRouterRelay.createElement}
    history={history} routes={routes}
  />,
  mountNode
);
