'use strict';

import AuthenticatedTypes from '../constants/AuthenticatedTypes';

var {
  AUTHENTICATED,
  NOT_AUTHENTICATED
} = AuthenticatedTypes;

function authenticated(meId) {
  return {
    type: AUTHENTICATED,
    meId
  };
}

function notAuthenticated() {
  return {
    type: NOT_AUTHENTICATED,
    meId: null
  };
}

module.exports.authenticated = authenticated;
module.exports.notAuthenticated = notAuthenticated;
