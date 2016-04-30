'use strict';

export const Events = {
  OPENED_APP: 'opened the app',
  SIGNED_IN: 'signed in',
  REGISTERED: 'registered',
  CREATED_PROJECT: 'created a project',
  ADDED_COVER_IMAGE: 'added a cover image',
  ADDED_TEST_CASE: 'added a test case',
  FULFILLED_TEST_CASE: 'fulfilled a test case',
  REJECTED_FULFILLMENT: 'rejected a fulfillment',
  UPDATED_PROFILE: 'updated their profile'
}

export const setIdentity = (token) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  let payload = {};
  let email;
  let id;
  if (token) {
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
      email = payload.email;
      id = payload.id;
      mixpanel.people.set({ $email: email });
      mixpanel.identify(id);
    } catch (e) {
      console.log(e);
    }
  }
}

export const track = (event, properties) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  mixpanel.track(
    event,
    properties
  );
}
