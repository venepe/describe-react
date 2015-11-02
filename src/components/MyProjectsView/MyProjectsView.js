'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import styles from './MyProjectsView.css';
import { Paper, FloatingActionButton, FontIcon } from 'material-ui';
import ProjectListView from '../ProjectListView';
import ProjectFormDialog from '../ProjectFormDialog';
import SMTIStorage from '../../utils/storage';

import IntroduceProjectMutation from '../../mutations/IntroduceProjectMutation';

const _first = 10;
const _next = 10;

class MyProjectsView extends Component {
  constructor(props) {
    super(props);
    this._onPressRow = this._onPressRow.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._introduceProject = this._introduceProject.bind(this);
  }

  _introduceProject() {
    let meId = SMTIStorage.getMeIdFromLocalStorage();
    this.refs.projectFormDialog.show(meId);
  }

  _onPressRow(project) {
    this.props.history.pushState(null, '/projects/' + project.id);
  }

  _onEndReached(cursor) {
    var first = this.props.relay.variables.first;
    this.props.relay.setVariables({
      first: first + _next,
      after: cursor
    });
  }

  render() {

    if(this.props.me) {
      var me = this.props.me
      if (me.originalProjects.edges.length > 0)
        return (
          <div className="MyProjects-container">
            <ProjectListView projects={this.props.me.originalProjects} onPressRow={this._onPressRow} onEndReached={this._onEndReached}/>
            <div className="add-project-button-container">
              <div className="add-project-button">
                <FloatingActionButton onClick={this._introduceProject}><FontIcon className="material-icons">add</FontIcon></FloatingActionButton>
              </div>
            </div>
            <ProjectFormDialog ref="projectFormDialog" />
          </div>
        );
      else {
        return (
          <div>
            <div className="add-project-button-container">
              <div className="add-project-button">
                <FloatingActionButton onClick={this._introduceProject}><FontIcon className="material-icons">add</FontIcon></FloatingActionButton>
              </div>
            </div>
            <ProjectFormDialog ref="projectFormDialog" />
          </div>
        );
      }
    } else {
      return (
        <div>
          <div className="add-project-button-container">
            <div className="add-project-button">
              <FloatingActionButton onClick={this._introduceProject}><FontIcon className="material-icons">add</FontIcon></FloatingActionButton>
            </div>
          </div>
          <ProjectFormDialog ref="projectFormDialog" />
        </div>
      );
    }
  }
}

var MyProjectsContainer = Relay.createContainer(MyProjectsView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    me: () => Relay.QL`
    fragment on User {
      id
      originalProjects: projects(first: $first) {
        edges
        ${ProjectListView.getFragment('projects')},
      }
      moreProjects: projects(first: $moreFirst, after: $after) {
        ${ProjectListView.getFragment('projects')},
      }
      ${IntroduceProjectMutation.getFragment('me')},
    }
    `,
  },
});


module.exports = MyProjectsContainer;
