'use strict';

import { isClientID } from '../utils/isClientID';
import _ from 'lodash';

let didDeleteCollaborationStore = {};
let didDeleteCollaboratorStore = {};
let didRejectFulfillmentStore = {};
let didDeleteProjectStore = {};
let didDeleteTestCaseStore = {};
let didIntroduceCollaboratorStore = {};
let didIntroduceCollaborationStore = {};
let didIntroduceFulfillmentStore = {};
let didIntroduceProjectStore = {};
let didIntroduceTestCaseStore = {};
let didUpdateProjectStore = {};
let didUpdateTestCaseStore = {};

function registerStore(store, {id, parentId}, subscribe) {
  if (!store[id] && !isClientID(id)) {
    store[id] = {
      parentId,
      subscription: subscribe()
    }
  }
}

export const registerDidDeleteCollaboration = ({collaborationId, meId}, subscribe) => {
  const id = collaborationId;
  const parentId = meId;
  registerStore(didDeleteCollaborationStore, {id, parentId}, subscribe);
}
export const registerDidDeleteCollaborator = ({collaboratorId, projectId}, subscribe) => {
  const id = collaboratorId;
  const parentId = projectId;
  registerStore(didDeleteCollaboratorStore, {id, parentId}, subscribe);
}
export const registerDidRejectFulfillment = ({fulfillmentId, testCaseId}, subscribe) => {
  const id = fulfillmentId;
  const parentId = testCaseId;
  registerStore(didRejectFulfillmentStore, {id, parentId}, subscribe);
}
export const registerDidDeleteProject = ({projectId, meId}, subscribe) => {
  const id = projectId;
  const parentId = meId;
  registerStore(didDeleteProjectStore, {id, parentId}, subscribe);
}

export const registerDidDeleteTestCase = ({testCaseId, projectId}, subscribe) => {
  const id = testCaseId;
  const parentId = projectId;
  registerStore(didDeleteTestCaseStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceCollaborator = ({projectId}, subscribe) => {
  const id = projectId;
  const parentId = id;
  registerStore(didIntroduceCollaboratorStore, {id, parentId}, subscribe);
}
export const registerDidIntroduceCollaboration = ({meId}, subscribe) => {
  const id = meId;
  const parentId = id;
  registerStore(didIntroduceCollaborationStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceFulfillment = ({testCaseId}, subscribe) => {
  const id = testCaseId;
  const parentId = id;
  registerStore(didIntroduceFulfillmentStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceProject = ({meId}, subscribe) => {
  const id = meId;
  const parentId = id;
  registerStore(didIntroduceProjectStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceTestCase = ({projectId}, subscribe) => {
  const id = projectId;
  const parentId = id;
  registerStore(didIntroduceTestCaseStore, {id, parentId}, subscribe);
}

export const registerDidUpdateProject = ({projectId}, subscribe) => {
  const id = projectId;
  const parentId = null;
  registerStore(didUpdateProjectStore, {id, parentId}, subscribe);
}
export const registerDidUpdateTestCase = ({testCaseId, projectId}, subscribe) => {
  const id = testCaseId;
  const parentId = projectId;
  registerStore(didUpdateTestCaseStore, {id, parentId}, subscribe);
}

export const cleanSubscriptions = (payload = {}) => {
  const action = Object.keys(payload)[0];
  if (action == 'didDeleteTestCase') {
    let testCaseId = payload[action].deletedTestCaseId;

    unsubscribe({store: didUpdateTestCaseStore, children: [{store: didRejectFulfillmentStore}]}, testCaseId);
    unsubscribe({store: didDeleteTestCaseStore}, testCaseId);
    unsubscribe({store: didIntroduceFulfillmentStore}, testCaseId);

  } else if (action == 'didRejectFulfillment') {

    let fulfillmentId = payload[action].rejectedFulfillmentId;

    unsubscribe({store: didRejectFulfillmentStore}, fulfillmentId);

  } else if (action == 'didDeleteProject') {
    let projectId = payload[action].deletedProjectId;

    unsubscribe({store: didUpdateProjectStore, children:[{store: didDeleteTestCaseStore, children: [{store: didRejectFulfillmentStore}]}]}, projectId);
    unsubscribe({store: didDeleteProjectStore, children: [{store: didDeleteCollaboratorStore}]}, projectId);
    unsubscribe({store: didIntroduceTestCaseStore}, projectId);
    unsubscribe({store: didIntroduceCollaboratorStore}, projectId);

  } else if (action == 'didDeleteCollaboration') {
    let projectId = payload[action].deletedCollaborationId;

    unsubscribe({store: didUpdateProjectStore, children:[{store: didDeleteTestCaseStore, children: [{store: didRejectFulfillmentStore}]}]}, projectId);
    unsubscribe({store: didDeleteProjectStore, children: [{store: didDeleteCollaboratorStore}]}, projectId);
    unsubscribe({store: didIntroduceTestCaseStore}, projectId);
    unsubscribe({store: didIntroduceCollaboratorStore}, projectId);

  } else if (action == 'didDeleteCollaborator') {
    let collaboratorId = payload[action].deletedCollaboratorId;

    unsubscribe({store: didDeleteCollaboratorStore}, collaboratorId);
  }
}

function unsubscribe(node = {}, id = '') {
  let store = node.store || {};
  let children = node.children || [];
  _.forEach(children, node => {
    let store = node.store;
    _.forEach(store, (obj, key) => {
      console.log(obj.parentId);
      if (obj.parentId === id) {
        unsubscribe(node, key);
      }
    });
  })
  if (store[id]) {
    store[id].subscription.dispose();
  }
}
