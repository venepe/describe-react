'use strict';

import { isClientID } from '../utils/isClientID';
import _ from 'lodash';

let didDeleteCollaborationStore = {};
let didDeleteCollaboratorStore = {};
let didDeleteCoverImageStore = {};
let didDeleteExampleStore = {};
let didDeleteFulfillmentStore = {};
let didDeleteProjectStore = {};
let didDeleteTestCaseStore = {};
let didIntroduceCollaboratorStore = {};
let didIntroduceCollaborationStore = {};
let didIntroduceCoverImageStore = {};
let didIntroduceExampleStore = {};
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

export const registerDidDeleteCollaboration = ({collaboration, me}, subscribe) => {
  const id = collaboration.id;
  const parentId = me.id;
  registerStore(didDeleteCollaborationStore, {id, parentId}, subscribe);
}
export const registerDidDeleteCollaborator = ({collaborator, project}, subscribe) => {
  const id = collaborator.id;
  const parentId = project.id;
  registerStore(didDeleteCollaboratorStore, {id, parentId}, subscribe);
}
export const registerDidDeleteCoverImage = ({coverImage, target}, subscribe) => {
  const id = coverImage.id;
  const parentId = target.id;
  registerStore(didDeleteCoverImageStore, {id, parentId}, subscribe);
}
export const registerDidDeleteExample = ({example, target}, subscribe) => {
  const id = example.id;
  const parentId = target.id;
  registerStore(didDeleteExampleStore, {id, parentId}, subscribe);
}
export const registerDidDeleteFulfillment = ({fulfillment, testCase}, subscribe) => {
  const id = fulfillment.id;
  const parentId = testCase.id;
  registerStore(didDeleteFulfillmentStore, {id, parentId}, subscribe);
}
export const registerDidDeleteProject = ({project, me}, subscribe) => {
  const id = project.id;
  const parentId = me.id;
  registerStore(didDeleteProjectStore, {id, parentId}, subscribe);
}

export const registerDidDeleteTestCase = ({testCase, project}, subscribe) => {
  const id = testCase.id;
  const parentId = project.id;
  registerStore(didDeleteTestCaseStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceCollaborator = ({project}, subscribe) => {
  const id = project.id;
  const parentId = id;
  registerStore(didIntroduceCollaboratorStore, {id, parentId}, subscribe);
}
export const registerDidIntroduceCollaboration = ({me}, subscribe) => {
  const id = me.id;
  const parentId = id;
  registerStore(didIntroduceCollaborationStore, {id, parentId}, subscribe);
}
export const registerDidIntroduceCoverImage = ({target}, subscribe) => {
  const id = target.id;
  const parentId = id;
  registerStore(didIntroduceCoverImageStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceExample = ({target}, subscribe) => {
  const id = target.id;
  const parentId = id;
  registerStore(didIntroduceExampleStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceFulfillment = ({testCase}, subscribe) => {
  const id = testCase.id;
  const parentId = id;
  registerStore(didIntroduceFulfillmentStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceProject = ({me}, subscribe) => {
  const id = me.id;
  const parentId = id;
  registerStore(didIntroduceProjectStore, {id, parentId}, subscribe);
}

export const registerDidIntroduceTestCase = ({project}, subscribe) => {
  const id = project.id;
  const parentId = id;
  registerStore(didIntroduceTestCaseStore, {id, parentId}, subscribe);
}

export const registerDidUpdateProject = ({project}, subscribe) => {
  const id = project.id;
  const parentId = null;
  registerStore(didUpdateProjectStore, {id, parentId}, subscribe);
}
export const registerDidUpdateTestCase = ({testCase, project}, subscribe) => {
  const id = testCase.id;
  const parentId = null;
  registerStore(didUpdateTestCaseStore, {id, parentId}, subscribe);
}

export const cleanSubscriptions = (payload = {}) => {
  const action = Object.keys(payload)[0];
  if (action == 'didDeleteTestCase') {
    let testCaseId = payload[action].deletedTestCaseId;

    unsubscribe({store: didUpdateTestCaseStore, children: [{store: didDeleteExampleStore}, {store: didDeleteFulfillmentStore}]}, testCaseId);
    unsubscribe({store: didDeleteTestCaseStore}, testCaseId);
    unsubscribe({store: didIntroduceFulfillmentStore}, testCaseId);
    unsubscribe({store: didIntroduceExampleStore}, testCaseId);

  } else if (action == 'didDeleteExample') {

    let exampleId = payload[action].deletedExampleId;

    unsubscribe({store: didDeleteExampleStore}, exampleId);

  } else if (action == 'didDeleteFulfillment') {

    let fulfillmentId = payload[action].deletedFulfillmentId;

    unsubscribe({store: didDeleteFulfillmentStore}, fulfillmentId);

  } else if (action == 'didDeleteCoverImage') {

    let coverImageId = payload[action].deletedCoverImageId;

    unsubscribe({store: didDeleteCoverImageStore}, coverImageId);

  } else if (action == 'didDeleteProject') {
    let projectId = payload[action].deletedProjectId;

    unsubscribe({store: didUpdateProjectStore, children:[{store: didDeleteTestCaseStore, children: [{store: didDeleteExampleStore}, {store: didDeleteFulfillmentStore}]}]}, projectId);
    unsubscribe({store: didDeleteProjectStore, children: [{store: didDeleteCollaboratorStore}, {store: didDeleteCoverImageStore}]}, projectId);
    unsubscribe({store: didIntroduceTestCaseStore}, projectId);
    unsubscribe({store: didIntroduceCoverImageStore}, projectId);
    unsubscribe({store: didIntroduceCollaboratorStore}, projectId);

  } else if (action == 'didDeleteCollaboration') {
    let projectId = payload[action].deletedCollaborationId;

    unsubscribe({store: didUpdateProjectStore, children:[{store: didDeleteTestCaseStore, children: [{store: didDeleteExampleStore}, {store: didDeleteFulfillmentStore}]}]}, projectId);
    unsubscribe({store: didDeleteProjectStore, children: [{store: didDeleteCollaboratorStore}, {store: didDeleteCoverImageStore}]}, projectId);
    unsubscribe({store: didIntroduceTestCaseStore}, projectId);
    unsubscribe({store: didIntroduceCoverImageStore}, projectId);
    unsubscribe({store: didIntroduceCollaboratorStore}, projectId);

  } else if (action == 'didDeleteCollaborator') {
    let collaboratorId = payload[action].deletedCollaboratorId;

    unsubscribe({store: didDeleteCollaboratorStore}, collaboratorId);
  }
}

function unsubscribe(node, id) {
  let store = node.store;
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
  store[id].subscription.dispose();
}
