'use strict';

function isValidPassword(password) {
  let isValid = (password.length > 5) ? true : false;
  return isValid;
}

module.exports.isValidPassword = isValidPassword;
