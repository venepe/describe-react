'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import styles from './MyProjectsView.css';
import { Paper, FloatingActionButton, FontIcon } from 'material-ui';
import ProjectListView from '../ProjectListView';
import ProjectFormDialog from '../ProjectFormDialog';
import MyProjectsPlaceholder from '../MyProjectsPlaceholder';
import SMTIToolbar from '../SMTIToolbar';
import SMTIStorage from '../../utils/storage';

import { IntroduceProjectMutation } from '../../mutations';
import { registerDidIntroduceProject } from '../../stores/SubscriptionStore';
import { DidIntroduceProjectSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class MyProjectsView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onPressRow = this._onPressRow.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._introduceProject = this._introduceProject.bind(this);
  }

  _introduceProject() {
    let meId = SMTIStorage.getMeIdFromLocalStorage();
    this.refs.projectFormDialog.show(meId);
  }

  _onPressRow(project) {
    this.router.push(`/projects/${project.id}/testCases`);
  }

  _onEndReached(cursor) {
    var first = this.props.relay.variables.first;
    this.props.relay.setVariables({
      first: first + _next,
      after: cursor
    });
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.me) {
      let me = this.props.me;
      let meId = me.id;

      registerDidIntroduceProject({meId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceProjectSubscription({me})
        );
      });
    }
  }

  render() {

    if(this.props.me) {
      var me = this.props.me;
      if (me.originalProjects.edges.length > 0) {
        return (
          <div className="MyProjects-container">
            <SMTIToolbar title={'Projects'} />
            <ProjectListView projects={this.props.me.originalProjects} me={this.props.me} onPressRow={this._onPressRow} onEndReached={this._onEndReached}/>
              <div className="add-project-button">
                <FloatingActionButton onClick={this._introduceProject}><FontIcon className="material-icons">add</FontIcon></FloatingActionButton>
              </div>
            <ProjectFormDialog ref="projectFormDialog" />
          </div>
        );
      } else {
        return (
          <div>
            <SMTIToolbar title={'Projects'} />
            <div className="add-project-button">
              <FloatingActionButton onClick={this._introduceProject}><FontIcon className="material-icons">add</FontIcon></FloatingActionButton>
            </div>
            <MyProjectsPlaceholder />
            <ProjectFormDialog ref="projectFormDialog" />
          </div>
        );
      }
    } else {
      return (
        <div>
          <SMTIToolbar title={'Projects'} />
          <div className="add-project-button">
            <FloatingActionButton onClick={this._introduceProject}><FontIcon className="material-icons">add</FontIcon></FloatingActionButton>
          </div>
          <MyProjectsPlaceholder />
          <ProjectFormDialog ref="projectFormDialog" />
        </div>
      );
    }
  }
}

export default Relay.createContainer(MyProjectsView, {
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
      ${DidIntroduceProjectSubscription.getFragment('me')},
      ${ProjectListView.getFragment('me')},
    }
    `,
  },
});
