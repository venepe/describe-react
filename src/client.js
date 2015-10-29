import createHashHistory from 'history/lib/createHashHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {Router} from 'react-router';
import ReactRouterRelay from 'react-router-relay';
import SMTIDefaultNetworkLayer from './utils/SMTIDefaultNetworkLayer';
import injectTapEventPlugin from 'react-tap-event-plugin';

import routes from './routes';

SMTIDefaultNetworkLayer.init();
injectTapEventPlugin();

const history = createHashHistory({queryKey: false});

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

const robotoFont = document.createElement('link');
robotoFont.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto:400,300,500');
robotoFont.setAttribute('rel', 'stylesheet');
robotoFont.setAttribute('type', 'text/css');
document.head.appendChild(robotoFont);

const materialIcons = document.createElement('link');
materialIcons.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
materialIcons.setAttribute('rel', 'stylesheet');
document.head.appendChild(materialIcons);


ReactDOM.render(
    <Router
      createElement={ReactRouterRelay.createElement}
      history={history} routes={routes}
    />,
  mountNode
);
