import {
  INTRODUCE_TEST_CASE,
  INTRODUCE_EXAMPLE,
  UPDATE_TEST_CASE,
  UPDATE_PROJECT,
  DELETE_TEST_CASE,
  DELETE_PROJECT,
  DELETE_EXAMPLE,
  REJECT_FULFILLMENT,
  SUBMIT_FULFILLMENT,
  DELETE_COVER_IMAGE,
  CHANGE_COVER_IMAGE,
  DELETE_COLLABORATOR,
  INTRODUCE_COLLABORATOR,
  LEAVE_PROJECT
} from './ModalTypes';

export const ProjectSheetOptions = {
  options: [
    {
      text: 'Add Test Case',
      value: INTRODUCE_TEST_CASE
    },
    {
      text: 'Edit Project',
      value: UPDATE_PROJECT
    },
    {
      text: 'Invite Collaborator',
      value:  INTRODUCE_COLLABORATOR
    },
  ],
};

export const CollaborativeProjectSheetOptions = {
  options: [
    {
      text: 'Add Test Case',
      value: INTRODUCE_TEST_CASE
    },
    {
      text: 'Edit Project',
      value: UPDATE_PROJECT
    },
    {
      text: 'Leave Project',
      value:  LEAVE_PROJECT
    },
  ],
}


export const SubmitTestCaseSheetOptions = {
  options: [
    {
      text: 'Submit Fulfillment',
      value: SUBMIT_FULFILLMENT
    },
    {
      text: 'Edit Test Case',
      value: UPDATE_TEST_CASE
    },
    {
      text: 'Delete Test Case',
      value:  DELETE_TEST_CASE
    },
  ],
};

export const RejectTestCaseSheetOptions = {
  options: [
    {
      text: 'Reject Fulfillment',
      value: REJECT_FULFILLMENT
    },
    {
      text: 'Edit Test Case',
      value: UPDATE_TEST_CASE
    },
    {
      text: 'Delete Test Case',
      value:  DELETE_TEST_CASE
    },
  ],
};

export const RejectFulfillmentSheetOptions = {
  options: [
    {
      text: 'Reject Fulfillment',
      value: REJECT_FULFILLMENT
    }
  ],
};

export const SubmitFulfillmentSheetOptions = {
  options: [
    {
      text: 'Submit Fulfillment',
      value: SUBMIT_FULFILLMENT
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
