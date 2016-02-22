'use strict';

import Relay from 'react-relay';

class DeleteExampleMutation extends Relay.Mutation {
  static fragments = {
    example: () => Relay.QL`
      fragment on File {
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
    return Relay.QL`mutation{deleteExample}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteExamplePayload {
        deletedExampleId,
        target {
          id
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'target',
      parentID: this.props.target.id,
      connectionName: 'examples',
      deletedIDFieldName: 'deletedExampleId',
    }];
  }
  getVariables() {
    return {
      id: this.props.example.id,
      targetId: this.props.target.id
    };
  }
  getOptimisticResponse() {
    return {
      deletedExampleId: this.props.example.id
    };
  }
}

module.exports = DeleteExampleMutation;
