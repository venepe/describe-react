'use strict';

import Relay from 'react-relay';

class UpdatePaperMutation extends Relay.Mutation {
  static fragments = {
    paper: () => Relay.QL`
      fragment on Paper {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updatePaper}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdatePaperPayload {
        paper {
          text,
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        paper: this.props.paper.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.paper.id,
      text: this.props.text,
    };
  }
  getOptimisticResponse() {
    return {
      paper: {
        id: this.props.paper.id,
        text: this.props.text,
      },
    };
  }
}

module.exports = UpdatePaperMutation;
