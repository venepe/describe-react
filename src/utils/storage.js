'use strict';

const tokenKey = 'SMTITokenKey';
const meIdKey = 'SMTIUserIdKey';

function saveToken(token) {
  return new Promise((resolve, reject) => {
    localStorage.setItem(tokenKey, token);
    resolve(token);
  });
}

function saveTokenAndMeId(token, meId) {
  return new Promise((resolve, reject) => {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(meIdKey, meId);
    resolve([token, meId]);
  });
}

function getToken() {
  return new Promise((resolve, reject) => {
    let token = localStorage.getItem(tokenKey);
    resolve(token);
  });
}

function getMeId() {
  return new Promise((resolve, reject) => {
    let meId = localStorage.getItem(meIdKey);
    resolve(meId);
  });
}

function getTokenAndMeId() {
  return new Promise((resolve, reject) => {
    let token = localStorage.getItem(tokenKey);
    let meId = localStorage.getItem(meIdKey);
    resolve([token, meId]);
  });
}

function clearCredentials() {
  return new Promise((resolve, reject) => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(meIdKey);
    resolve();
  });
}

function getMeIdFromLocalStorage() {
  return localStorage.getItem(meIdKey);
}

function getTokenFromLocalStorage() {
  return localStorage.getItem(tokenKey);
}

module.exports.saveToken = saveToken;
module.exports.saveTokenAndMeId = saveTokenAndMeId;
module.exports.getToken = getToken;
module.exports.getMeId = getMeId;
module.exports.getTokenAndMeId = getTokenAndMeId;
module.exports.clearCredentials = clearCredentials;
module.exports.getMeIdFromLocalStorage = getMeIdFromLocalStorage;
module.exports.getTokenFromLocalStorage = getTokenFromLocalStorage;
