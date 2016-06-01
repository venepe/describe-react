'use strict';

export const isValidPassword = (password) => {
  let isValid = (password.length > 5) ? true : false;
  return isValid;
}

export const isValidName = (name) => {
  let isValid = name.match(/^[a-zA-Z0-9_]{4,32}$/);
  return isValid;
}

export const isValidTitle = (title) => {
  let isValid = title.match(/^.{1,150}$/);
  return isValid;
}

export const isValidTestCase = (testCase) => {
  let isValid = testCase.match(/^.{1,150}$/);
  return isValid;
}

export const isValidRejection = (rejection) => {
  let isValid = rejection.match(/^.{1,150}$/);
  return isValid;
}

export const isValidMessage = (testCase) => {
  let isValid = testCase.match(/^.{1,150}$/);
  return isValid;
}

export const getProjectPlaceholderText = () => {
  var placeholders = ['my dream house', 'my summer vacation', 'my garden', 'a new dinner table', 'the patio window'];
  var index = getRandomArbitrary(0, placeholders.length);
  return placeholders[index];
}

export const getTestCasePlaceholderText = () => {
  var placeholders = ['be a shade of blue', 'go 0 to 60 in under 4 secs', 'fit four people', 'have stainless steel tubing'];
  var index = getRandomArbitrary(0, placeholders.length);
  return placeholders[index];
}

export const getCollaboratorPlaceholderText = () => {
  let placeholders = ['jane@doe.com', 'john@doe.com'];
  let index = getRandomArbitrary(0, placeholders.length);
  return placeholders[index];
}

export const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min ) + min);
}
