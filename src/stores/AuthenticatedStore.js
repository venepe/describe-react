'use strict';

import AuthenticatedTypes from '../constants/AuthenticatedTypes';

const {
  AUTHENTICATED,
  NOT_AUTHENTICATED
} = AuthenticatedTypes;

const initialState = {
  isAuthenticated: false,
  meId: null
};

function isAuthenticated(state = initialState, action) {
  switch (action.type) {
  case AUTHENTICATED:
  return Object.assign({}, state, {
    meId: action.meId,
    isAuthenticated: true
  });
  case NOT_AUTHENTICATED:
  return Object.assign({}, state, {
    meId: action.meId,
    isAuthenticated: false
  });
  default:
    return state;
  }
}

export default isAuthenticated;
