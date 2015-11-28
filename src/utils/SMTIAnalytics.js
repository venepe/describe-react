'use strict';

let Events = {
  OPENED_APP: 'opened the app',
  SIGNED_IN: 'signed in',
  REGISTERED: 'registered',
  CREATED_PROJECT: 'created a project',
  ADDED_COVER_IMAGE: 'added a cover image',
  ADDED_TEST_CASE: 'added a test case',
  ADDED_EXAMPLE: 'added an example',
  FULFILLED_TEST_CASE: 'fulfilled a test case',
  UPDATED_PROFILE: 'updated their profile'
}

function setIdentity(token) {
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

function track(event, properties) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  mixpanel.track(
    event,
    properties
  );
}

module.exports.Events = Events;
module.exports.setIdentity = setIdentity;
module.exports.track = track;
