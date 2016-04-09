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
        projectEventEdge {
          node {
            id
            title
          }
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
    },
    {
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.project.id,
      connectionName: 'events',
      edgeName: 'projectEventEdge',
      rangeBehaviors: {
        '': 'append',
      }
    },
  ];
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
      projectEventEdge: {
        node: {
          title: this.props.title,
        }
      }
    };
  }
}
