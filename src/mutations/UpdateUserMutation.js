'use strict';

import Relay from 'react-relay';

class UpdateUserMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateUser}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user {
          email
          summary
          fullName
          username
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.user.id,
      email: this.props.email,
      summary: this.props.summary,
      fullName: this.props.fullName,
      username: this.props.username
    };
  }
  getOptimisticResponse() {
    return {
      user: {
        id: this.props.user.id,
        email: this.props.email,
        summary: this.props.summary,
        fullName: this.props.fullName,
        username: this.props.username
      },
    };
  }
}

module.exports = UpdateUserMutation;
