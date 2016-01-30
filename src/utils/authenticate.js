'use strict';

import SMTIStorage from './storage';
import SMTIConstants, { SMTIBaseUrl } from '../constants';
import SMTIDefaultNetworkLayer from './SMTIDefaultNetworkLayer';

function login(email, password) {
  let authenticate = {email, password};
  return new Promise((resolve, reject) => {
    fetch(SMTIBaseUrl + '/authenticate', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({authenticate})
      })
      .then(status)
      .then(json)
      .then((json) => {
        let authenticate = json.authenticate || {};
        let token = authenticate.token || '';
        let id = authenticate.id || '';
        return SMTIStorage.saveTokenAndMeId(token, id);
      })
      .then((result) => {
        let token = result[0];
        let meId = result[1];
        SMTIDefaultNetworkLayer.init(token);
        resolve(meId);
      }).catch((error) => {
        reject();
      })
  });
}

function register(email, password) {
  let register = {email, password};
  return new Promise((resolve, reject) => {
    fetch(SMTIBaseUrl + '/register', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({register})
      })
      .then(status)
      .then(json)
      .then((json) => {
        let register = json.register || {};
        let token = register.token || '';
        let id = register.id || '';
        return SMTIStorage.saveTokenAndMeId(token, id);
      })
      .then((result) => {
        let token = result[0];
        let meId = result[1];
        SMTIDefaultNetworkLayer.init(token);
        resolve(meId);
      }).catch((error) => {
        reject();
      })
  });
}

function refreshToken() {
  return new Promise((resolve, reject) => {
    SMTIStorage.getToken()
      .then((token) => {
        return fetch(SMTIBaseUrl + '/token', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-smti-authorization': token
            },
            body: JSON.stringify({})
          })
      })
      .then(status)
      .then(json)
      .then((json) => {
        let token = json.token || '';
        return SMTIStorage.saveToken(token);
      })
      .then((token) => {
        SMTIDefaultNetworkLayer.init(token);
        resolve(token);
      }).catch((error) => {
        console.log('did fail');
        SMTIDefaultNetworkLayer.init();
        reject();
      })
  });
}

function password(currentPassword, newPassword) {
  let password = {current: currentPassword, new: newPassword};
  return new Promise((resolve, reject) => {
    SMTIStorage.getToken()
      .then((token) => {
        return fetch(SMTIBaseUrl + '/password', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-smti-authorization': token
            },
            body: JSON.stringify({password})
          })
      })
      .then(status)
      .then(json)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject();
      })
  });
}

function forgot(email) {
  let forgot = {email};
  return new Promise((resolve, reject) => {
    fetch(SMTIBaseUrl + '/forgot', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({forgot})
      })
      .then(status)
      .then(json)
      .then((result) => {
        resolve();
      }).catch((error) => {
        reject();
      })
  });
}

function reset(token, id, password) {
  let reset = {id, password};
  return new Promise((resolve, reject) => {
    fetch(SMTIBaseUrl + '/reset', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-smti-authorization': token
            },
            body: JSON.stringify({reset})
      })
      .then(status)
      .then(json)
      .then((json) => {
        resolve();
      }).catch((error) => {
        reject();
      })
  });
}

function unregister() {
  return new Promise((resolve, reject) => {
    SMTIStorage.getTokenAndMeId()
      .then((result) => {
        let token = result[0];
        let meId = result[1];
        return fetch(SMTIBaseUrl + '/unregister', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-smti-authorization': token
            },
            body: JSON.stringify({unregister: {userId: meId}})
          })
      })
      .then(status)
      .then(json)
      .then((result) => {
        return this.logoff();
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject();
      })
  });
}

function logoff() {
  return new Promise((resolve, reject) => {
    SMTIStorage.clearCredentials()
      .then(() => {
        SMTIDefaultNetworkLayer.init();
        resolve();
      }).catch((error) => {
        SMTIDefaultNetworkLayer.init();
        reject();
      })
  });
}

function isLoggedIn() {
  return !!SMTIStorage.getTokenFromLocalStorage();
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  throw new Error(response.statusText)
}

function json(response) {
  return response.json()
}

module.exports.login = login;
module.exports.logoff = logoff;
module.exports.register = register;
module.exports.refreshToken = refreshToken;
module.exports.password = password;
module.exports.forgot = forgot;
module.exports.isLoggedIn = isLoggedIn;
module.exports.unregister = unregister;
module.exports.reset = reset;
