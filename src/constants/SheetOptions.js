import {
  INTRODUCE_COLLABORATOR,
  INTRODUCE_TEST_CASE,
  INTRODUCE_EXAMPLE,
  FULFILL_TEST_CASE,
  UPDATE_TEST_CASE,
  UPDATE_PROJECT,
  DELETE_TEST_CASE,
  DELETE_PROJECT,
  DELETE_EXAMPLE,
  DELETE_FULFILLMENT,
  DELETE_COVER_IMAGE,
  CHANGE_COVER_IMAGE,
  DELETE_COLLABORATOR,
  LEAVE_PROJECT
} from './ModalTypes';

const projectSheet = {
  options: [
    {
      text: 'Add Collaborator',
      value: INTRODUCE_COLLABORATOR
    },
    {
      text: 'Add Test Case',
      value: INTRODUCE_TEST_CASE
    },
    {
      text: 'Update Project',
      value: UPDATE_PROJECT
    },
    {
      text: 'Delete Project',
      value:  DELETE_PROJECT
    },
  ],
};

const collaborativeProjectSheet = {
  options: [
    {
      text: 'Add Test Case',
      value: INTRODUCE_TEST_CASE
    },
    {
      text: 'Leave Project',
      value:  LEAVE_PROJECT
    },
  ],
}


const testCaseSheet = {
  options: [
    {
      text: 'Add Example',
      value: INTRODUCE_EXAMPLE
    },
    {
      text: 'Fulfill Test Case',
      value: FULFILL_TEST_CASE
    },
    {
      text: 'Update Test Case',
      value: UPDATE_TEST_CASE
    },
    {
      text: 'Delete Test Case',
      value:  DELETE_TEST_CASE
    },
  ],
};

const exampleSheet = {
  options: [
    {
      text: 'Delete Example',
      value: DELETE_EXAMPLE
    }
  ],
};

const fulfillmentSheet = {
  options: [
    {
      text: 'Delete Fulfillment',
      value: DELETE_FULFILLMENT
    }
  ],
};

const collaboratorSheet = {
  options: [
    {
      text: 'Delete Collaborator',
      value: DELETE_COLLABORATOR
    }
  ],
}

const coverImageSheet = {
  options: [
    {
      text: 'Change Cover Image',
      value: CHANGE_COVER_IMAGE
    },
    {
      text: 'Delete Cover Image',
      value: DELETE_COVER_IMAGE
    }
  ],
};

module.exports = {
  collaboratorSheet: collaboratorSheet,
  collaborativeProjectSheet: collaborativeProjectSheet,
  projectSheet: projectSheet,
  testCaseSheet: testCaseSheet,
  exampleSheet: exampleSheet,
  fulfillmentSheet: fulfillmentSheet,
  coverImageSheet: coverImageSheet
}
