'use strict';

const permissions = {
  NONE: 0,
  UPDATE_NODE: 1,
  DELETE_NODE: 2,
  ADD_EDGE: 4,
  REMOVE_EDGE: 8,
}

const regExRoles = {
  updateNode: '1|3|5|7|15',
  deleteNode: '2|3|6|7|15',
  addEdge: '4|5|6|7|15',
  removeEdge: '8|9|10|12|15',
}

const hasUpdateNodePerm = (perm) => {
  perm = perm || 0;
  let regEx = new RegExp(regExRoles.updateNode);
  return regEx.test(perm);
}

const hasDeleteNodePerm = (perm) => {
  perm = perm || 0;
  let regEx = new RegExp(regExRoles.deleteNode);
  return regEx.test(perm.toString());
}

const hasAddEdgePerm = (perm) => {
  perm = perm || 0;
  let regEx = new RegExp(regExRoles.addEdge);
  return regEx.test(perm);
}

const hasRemoveEdgePerm = (perm) => {
  perm = perm || 0;
  let regEx = new RegExp(regExRoles.removeEdge);
  return regEx.test(perm);
}

export { permissions, regExRoles, hasUpdateNodePerm, hasDeleteNodePerm, hasAddEdgePerm, hasRemoveEdgePerm };
