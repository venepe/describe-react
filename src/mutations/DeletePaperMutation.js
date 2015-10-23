'use strict';

import Relay from 'react-relay';

class DeletePaperMutation extends Relay.Mutation {
  static fragments = {
    paper: () => Relay.QL`
      fragment on Paper {
        id
      }
    `,
    target: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{deletePaper}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeletePaperPayload {
        deletedPaperId,
        target
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'papers',
      deletedIDFieldName: 'deletedPaperId',
    }];
  }
  getVariables() {
    return {
      id: this.props.paper.id,
    };
  }
  getOptimisticResponse() {
    return {
      deletedPaperId: this.props.paper.id
    };
  }
}

module.exports = DeletePaperMutation;
