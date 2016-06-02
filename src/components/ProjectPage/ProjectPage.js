'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectPage.css';
import ProjectToolbar from '../ProjectToolbar';
import ProjectView from '../ProjectView';

class ProjectPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushCollaborators = this._pushCollaborators.bind(this);
  }


  _pushCollaborators() {
    let projectId = this.props.project.id;
    this.router.push(`/projects/${projectId}/collaborators`);
  }

  render() {
    return (
      <div className="ProjectPage-container">
        <ProjectToolbar title={this.props.project.text} onClick={this._pushCollaborators} />
        <ProjectView project={this.props.project} me={this.props.me} />
      </div>
    );
  }
}

export default Relay.createContainer(ProjectPage, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        text
        ${ProjectView.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${ProjectView.getFragment('me')},
      }
    `,
  },
});
