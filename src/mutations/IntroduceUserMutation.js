'use strict';

import Relay from 'react-relay';

class IntroduceUserMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{introduceUser}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceUserPayload {
        user
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: null,
      parentID: null,
      connectionName: null,
      edgeName: null,
      rangeBehaviors: {
        // When the ships connection is not under the influence
        // of any call, append the ship to the end of the connection
        // '': 'prepend',
        // Prepend the ship, wherever the connection is sorted by age
        // 'orderby:newest': 'prepend',
      },
    }];
  }
  getVariables() {
    return {
      email: this.props.email,
      password: this.props.password,
    };
  }
  getOptimisticResponse() {
    return {
      user: {
        email: this.props.email,
        password: this.props.password
      },
    };
  }
}

module.exports = IntroduceUserMutation;
