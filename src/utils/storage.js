'use strict';

const tokenKey = 'SMTITokenKey';
const meIdKey = 'SMTIUserIdKey';

const saveToken = (token) => {
  return new Promise((resolve, reject) => {
    localStorage.setItem(tokenKey, token);
    resolve(token);
  });
}

const saveTokenAndMeId = (token, meId) => {
  return new Promise((resolve, reject) => {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(meIdKey, meId);
    resolve([token, meId]);
  });
}

const getToken = () => {
  return new Promise((resolve, reject) => {
    let token = localStorage.getItem(tokenKey);
    resolve(token);
  });
}

const getMeId = () => {
  return new Promise((resolve, reject) => {
    let meId = localStorage.getItem(meIdKey);
    resolve(meId);
  });
}

const getTokenAndMeId = () => {
  return new Promise((resolve, reject) => {
    let token = localStorage.getItem(tokenKey);
    let meId = localStorage.getItem(meIdKey);
    resolve([token, meId]);
  });
}

const clearCredentials = () => {
  return new Promise((resolve, reject) => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(meIdKey);
    resolve();
  });
}

const getMeIdFromLocalStorage = () => {
  return localStorage.getItem(meIdKey);
}

const getTokenFromLocalStorage = () => {
  return localStorage.getItem(tokenKey);
}

const Storage = {
  saveToken,
  saveTokenAndMeId,
  getToken,
  getMeId,
  getTokenAndMeId,
  clearCredentials,
  getMeIdFromLocalStorage,
  getTokenFromLocalStorage,
}

export default Storage
