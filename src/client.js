'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { RelayRouter } from 'react-router-relay';
import SMTIDefaultNetworkLayer from './utils/SMTIDefaultNetworkLayer';
import SMTIStorage from './utils/storage';
import injectTapEventPlugin from 'react-tap-event-plugin';

import routes from './routes';

let token = SMTIStorage.getTokenFromLocalStorage();
SMTIDefaultNetworkLayer.init(token);
injectTapEventPlugin();

const history = useRouterHistory(createHashHistory)({ queryKey: false })

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

(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("2aaf0f688a40c17f7b9fe80ba178de3e");


ReactDOM.render(
  <RelayRouter history={history} routes={routes} />,
  mountNode
);
