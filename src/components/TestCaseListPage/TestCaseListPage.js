'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseListPage.css';
import ProjectToolbar from '../ProjectToolbar';
import TestCaseListView from '../TestCaseListView';
import ProjectActionButton from '../ProjectActionButton';

class TestCaseListPage extends Component {
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
      <div className="TestCaseListPage-container">
        <ProjectToolbar title={this.props.project.text} onClick={this._pushCollaborators} />
        <TestCaseListView project={this.props.project} me={this.props.me} />
        <ProjectActionButton project={this.props.project} />
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseListPage, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        text
        ${TestCaseListView.getFragment('project')},
        ${ProjectActionButton.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${TestCaseListView.getFragment('me')},
      }
    `,
  },
});
