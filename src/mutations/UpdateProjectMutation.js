'use strict';

import Relay from 'react-relay';

export default class UpdateProjectMutation extends Relay.Mutation {
  static fragments = {
    project: () => Relay.QL`
      fragment on Project {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateProject}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateProjectPayload {
        project {
          title,
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        project: this.props.project.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.project.id,
      title: this.props.title,
    };
  }
  getOptimisticResponse() {
    return {
      project: {
        id: this.props.project.id,
        title: this.props.title,
      },
    };
  }
}
