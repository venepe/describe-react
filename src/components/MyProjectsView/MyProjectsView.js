'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import styles from './MyProjectsView.css';
import { Paper } from 'material-ui';
import ProjectListView from '../ProjectListView';

import MeRoute from '../../routes/MeRoute';

import IntroduceProjectMutation from '../../mutations/IntroduceProjectMutation';

const _first = 10;
const _next = 10;

class MyProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meId: props.meId
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  render() {
    var meId = this.state.meId;
    meId = 'VXNlcjo0Yzk5MDVkOC1kMmE3LTRlNDItOWI0Yi02OTlhM2U5MTcyYjM=';
    var meRoute = new MeRoute({meId});
    return (
      <div>
        <Relay.RootContainer Component={MyProjectsContainer} route={meRoute} renderFetched={data => <MyProjectsContainer {...data} /> } />
      </div>
    );
  }
}

class MyProjectsView extends Component {
  constructor(props) {
    super(props);
    this._onPressRow = this._onPressRow.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
  }

  _onPressRow(project) {
  }

  _onEndReached(cursor) {
    // var first = this.props.relay.variables.first;
    // this.props.relay.setVariables({
    //   first: first + _next,
    //   after: cursor
    // });
  }

  render() {

    if(this.props.me) {
      var me = this.props.me
      if (me.originalProjects.edges.length > 0)
        return (
          <ProjectListView projects={this.props.me.originalProjects}/>
        );
      else {
        return (
          <div>
          </div>
        );
      }
    } else {
      return (
        <div></div>
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


module.exports = MyProjects;
