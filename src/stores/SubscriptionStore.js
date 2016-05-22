'use strict';

import { isClientID } from '../utils/isClientID';
import _ from 'lodash';

let didDeleteCollaborationStore = {};
let didDeleteCollaboratorStore = {};
let didUpdateFulfillmentStore = {};
let didDeleteProjectStore = {};
let didDeleteTestCaseStore = {};
let didIntroduceCollaboratorStore = {};
let didIntroduceCollaborationStore = {};
let didIntroduceFulfillmentStore = {};
let didIntroduceProjectStore = {};
let didIntroduceTestCaseStore = {};
let didUpdateProjectStore = {};
let didUpdateTestCaseStore = {};

let didIntroduceInviteeStore = {};
let didDeleteInviteeStore = {};
let didIntroduceInvitationStore = {};
let didDeclineInvitationStore = {};
let didAcceptInvitationStore = {};

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
export const registerDidUpdateFulfillment = ({fulfillmentId, testCaseId}, subscribe) => {
  const id = fulfillmentId;
  const parentId = testCaseId;
  registerStore(didUpdateFulfillmentStore, {id, parentId}, subscribe);
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
export const registerDidDeclineInvitation = ({invitationId, meId}, subscribe) => {
  const id = invitationId;
  const parentId = meId;
  registerStore(didDeclineInvitationStore, {id, parentId}, subscribe);
}
export const registerDidAcceptInvitation = ({invitationId, meId}, subscribe) => {
  const id = invitationId;
  const parentId = meId;
  registerStore(didAcceptInvitationStore, {id, parentId}, subscribe);
}
export const registerDidDeleteInvitee = ({inviteeId, projectId}, subscribe) => {
  const id = inviteeId;
  const parentId = projectId;
  registerStore(didDeleteInviteeStore, {id, parentId}, subscribe);
}
export const registerDidIntroduceInvitee = ({projectId}, subscribe) => {
  const id = projectId;
  const parentId = id;
  registerStore(didIntroduceInviteeStore, {id, parentId}, subscribe);
}
export const registerDidIntroduceInvitation = ({meId}, subscribe) => {
  const id = meId;
  const parentId = id;
  registerStore(didIntroduceInvitationStore, {id, parentId}, subscribe);
}

export const cleanSubscriptions = (payload = {}) => {
  const action = Object.keys(payload)[0];
  if (action == 'didDeleteTestCase') {
    let testCaseId = payload[action].deletedTestCaseId;

    unsubscribe({store: didUpdateTestCaseStore, children: [{store: didUpdateFulfillmentStore}]}, testCaseId);
    unsubscribe({store: didDeleteTestCaseStore}, testCaseId);
    unsubscribe({store: didIntroduceFulfillmentStore}, testCaseId);

  } else if (action == 'didDeleteProject') {
    let projectId = payload[action].deletedProjectId;

    unsubscribe({store: didUpdateProjectStore, children:[{store: didDeleteTestCaseStore, children: [{store: didUpdateFulfillmentStore}]}]}, projectId);
    unsubscribe({store: didDeleteProjectStore, children: [{store: didDeleteCollaboratorStore}, {store: didDeleteInviteeStore}]}, projectId);
    unsubscribe({store: didIntroduceTestCaseStore}, projectId);
    unsubscribe({store: didIntroduceCollaboratorStore}, projectId);
    unsubscribe({store: didIntroduceInviteeStore}, projectId);

  } else if (action == 'didDeleteCollaboration') {
    let projectId = payload[action].deletedCollaborationId;

    unsubscribe({store: didUpdateProjectStore, children:[{store: didDeleteTestCaseStore, children: [{store: didUpdateFulfillmentStore}]}]}, projectId);
    unsubscribe({store: didDeleteProjectStore, children: [{store: didDeleteCollaboratorStore}, {store: didDeleteInviteeStore}]}, projectId);
    unsubscribe({store: didIntroduceTestCaseStore}, projectId);
    unsubscribe({store: didIntroduceCollaboratorStore}, projectId);
    unsubscribe({store: didIntroduceInviteeStore}, projectId);

  } else if (action == 'didDeleteCollaborator') {
    let collaboratorId = payload[action].deletedCollaboratorId;

    unsubscribe({store: didDeleteCollaboratorStore}, collaboratorId);
  } else if (action == 'didDeleteInvitee') {
    let inviteeId = payload[action].deletedInviteeId;

    unsubscribe({store: didDeleteInviteeStore}, inviteeId);
  } else if (action == 'didAcceptInvitation') {
    let invitationId = payload[action].acceptedInvitationId;

    unsubscribe({store: didAcceptInvitationStore}, invitationId);
    unsubscribe({store: didDeclineInvitationStore}, invitationId);
  } else if (action == 'didDeclineInvitation') {
    let invitationId = payload[action].declinedInvitationId;

    unsubscribe({store: didAcceptInvitationStore}, invitationId);
    unsubscribe({store: didDeclineInvitationStore}, invitationId);
  }
}

function unsubscribe(node = {}, id = '') {
  let store = node.store || {};
  let children = node.children || [];
  _.forEach(children, node => {
    let store = node.store;
    _.forEach(store, (obj, key) => {
      if (obj.parentId === id) {
        unsubscribe(node, key);
      }
    });
  })
  if (store[id]) {
    store[id].subscription.dispose();
  }
}
