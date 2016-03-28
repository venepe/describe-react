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

export const ProjectSheetOptions = {
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

export const CollaborativeProjectSheetOptions = {
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
      text: 'Leave Project',
      value:  LEAVE_PROJECT
    },
  ],
}


export const TestCaseSheetOptions = {
  options: [
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

export const FulfillmentSheetOptions = {
  options: [
    {
      text: 'Delete Fulfillment',
      value: DELETE_FULFILLMENT
    }
  ],
};

export const CollaboratorSheetOptions = {
  options: [
    {
      text: 'Delete Collaborator',
      value: DELETE_COLLABORATOR
    }
  ],
}

export const CoverImageSheetOptions = {
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
