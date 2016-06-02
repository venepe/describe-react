'use strict';

import Relay from 'react-relay';

export default class AcceptInvitationMutation extends Relay.Mutation {
  static fragments = {
    invitation: () => Relay.QL`
      fragment on Invitation {
        id
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{acceptInvitation}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AcceptInvitationPayload {
        acceptedInvitationId
        collaborationEdge {
          node {
            id
            text
            numOfTestCases
            numOfTestCasesFulfilled
          }
        }
        me {
          collaborations
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'collaborations',
      edgeName: 'collaborationEdge',
      rangeBehaviors: {
        '': 'append',
      },
    },
    {
      type: 'NODE_DELETE',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'invitations',
      deletedIDFieldName: 'acceptedInvitationId',
    }];
  }
  getVariables() {
    return {
      id: this.props.invitation.id,
    };
  }
  getOptimisticResponse() {
    return {
      collaborationEdge: {
        node: this.props.invitation.project,
      },
      acceptedInvitationId: this.props.invitation.id
    };
  }
}
