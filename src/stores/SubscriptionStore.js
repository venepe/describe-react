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
let didIntroduceTestCaseStore = {};
let didUpdateProjectStore = {};
let didUpdateTestCaseStore = {};

export const registerDidDeleteCollaboration = ({collaboration, me}, subscribe) => {
  const collaborationId = collaboration.id;
  if (!didDeleteCollaborationStore[collaborationId] && !isClientID(collaborationId)) {
    didDeleteCollaborationStore[collaborationId] = subscribe();
  }
}
export const registerDidDeleteCollaborator = ({collaborator, project}, subscribe) => {
  const collaboratorId = collaborator.id;
  if (!didDeleteCollaboratorStore[collaboratorId] && !isClientID(collaboratorId)) {
    didDeleteCollaboratorStore[collaboratorId] = subscribe();
  }
}
export const registerDidDeleteCoverImage = ({coverImage, target}, subscribe) => {
  const coverImageId = coverImage.id;
  if (!didDeleteCoverImageStore[coverImageId] && !isClientID(coverImageId)) {
    didDeleteCoverImageStore[coverImageId] = subscribe();
  }
}
export const registerDidDeleteExample = ({example, target}, subscribe) => {
  const exampleId = example.id;
  if (!didDeleteExampleStore[exampleId] && !isClientID(exampleId)) {
    didDeleteExampleStore[exampleId] = subscribe();
  }
}
export const registerDidDeleteFulfillment = ({fulfillment, testCase}, subscribe) => {
  const fulfillmentId = fulfillment.id;
  if (!didDeleteFulfillmentStore[fulfillmentId] && !isClientID(fulfillmentId)) {
    didDeleteFulfillmentStore[fulfillmentId] = subscribe();
  }
}
export const registerDidDeleteProject = ({project, me}, subscribe) => {
  const projectId = project.id;
  if (!didDeleteProjectStore[projectId] && !isClientID(projectId)) {
    didDeleteProjectStore[projectId] = subscribe();
  }
}

export const registerDidDeleteTestCase = ({testCase, project}, subscribe) => {
  const testCaseId = testCase.id;
  if (!didDeleteTestCaseStore[testCaseId] && !isClientID(testCaseId)) {
    didDeleteTestCaseStore[testCaseId] = subscribe();
  }
}

export const registerDidIntroduceCollaborator = ({project}, subscribe) => {
  const projectId = project.id;
  if (!didIntroduceCollaboratorStore[projectId] && !isClientID(projectId)) {
    didIntroduceCollaboratorStore[projectId] = subscribe();
  }
}
export const registerDidIntroduceCollaboration = ({me}, subscribe) => {
  const meId = me.id;
  if (!didIntroduceCollaborationStore[meId] && !isClientID(meId)) {
    didIntroduceCollaborationStore[meId] = subscribe();
  }
}
export const registerDidIntroduceCoverImage = ({target}, subscribe) => {
  const targetId = target.id;
  if (!didIntroduceCoverImageStore[targetId] && !isClientID(targetId)) {
    didIntroduceCoverImageStore[targetId] = subscribe();
  }
}

export const registerDidIntroduceExample = ({target}, subscribe) => {
  const targetId = target.id;
  if (!didIntroduceExampleStore[targetId] && !isClientID(targetId)) {
    didIntroduceExampleStore[targetId] = subscribe();
  }
}

export const registerDidIntroduceFulfillment = ({testCase}, subscribe) => {
  const testCaseId = testCase.id;
  if (!didIntroduceFulfillmentStore[testCaseId] && !isClientID(testCaseId)) {
    didIntroduceFulfillmentStore[testCaseId] = subscribe();
  }
}

export const registerDidIntroduceTestCase = ({project}, subscribe) => {
  const projectId = project.id;
  if (!didIntroduceTestCaseStore[projectId] && !isClientID(projectId)) {
    didIntroduceTestCaseStore[projectId] = subscribe();
  }
}

export const registerDidUpdateProject = ({project}, subscribe) => {
  const projectId = project.id;
  if (!didUpdateProjectStore[projectId] && !isClientID(projectId)) {
    didUpdateProjectStore[projectId] = subscribe();
  }
}
export const registerDidUpdateTestCase = ({testCase}, subscribe) => {
  const testCaseId = testCase.id;
  if (!didUpdateTestCaseStore[testCaseId] && !isClientID(testCaseId)) {
    didUpdateTestCaseStore[testCaseId] = subscribe();
  }
}

export const cleanSubscriptions = (payload) => {
  console.log(Object.keys(payload)[0]);
  const action = Object.keys(payload)[0];
  if (action == 'didDeleteTestCase') {

  }
}
