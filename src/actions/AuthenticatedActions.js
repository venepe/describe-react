'use strict';

import { AUTHENTICATED, NOT_AUTHENTICATED } from '../constants/AuthenticatedTypes';

export const authenticated = (meId) => {
  return {
    type: AUTHENTICATED,
    meId
  };
}

export const notAuthenticated = () => {
  return {
    type: NOT_AUTHENTICATED,
    meId: null
  };
}
