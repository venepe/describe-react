'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectEventListPage.css';
import SMTIToolbar from '../SMTIToolbar';
import ProjectEventListView from '../ProjectEventListView';

class ProjectEventListPage extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <div className="ProjectEventListPage-container">
        <SMTIToolbar title={this.props.project.title} />
        <ProjectEventListView project={this.props.project} me={this.props.me} />
      </div>
    );
  }
}

export default Relay.createContainer(ProjectEventListPage, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        title
        ${ProjectEventListView.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${ProjectEventListView.getFragment('me')},
      }
    `,
  },
});
