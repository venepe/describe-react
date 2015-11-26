'use strict';

function isValidPassword(password) {
  let isValid = (password.length > 5) ? true : false;
  return isValid;
}

function getProjectPlaceholderText() {
  var placeholders = ['my dream house', 'my summer vacation', 'my garden', 'a new dinner table', 'the patio window'];
  var index = getRandomArbitrary(0, placeholders.length);
  return placeholders[index];
}

function getTestCasePlaceholderText() {
  var placeholders = ['be a shade of blue', 'go 0 to 60 in under 4 secs', 'fit four people', 'have stainless steel tubing'];
  var index = getRandomArbitrary(0, placeholders.length);
  return placeholders[index];
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min ) + min);
}

module.exports.isValidPassword = isValidPassword;
module.exports.getProjectPlaceholderText = getProjectPlaceholderText;
module.exports.getTestCasePlaceholderText = getTestCasePlaceholderText;
