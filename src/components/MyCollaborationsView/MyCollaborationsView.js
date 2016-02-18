'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import styles from './MyCollaborationsView.css';
import { Paper, FloatingActionButton, FontIcon } from 'material-ui';
import ProjectListView from '../ProjectListView';
import MyCollaborationsPlaceholder from '../MyCollaborationsPlaceholder';
import SMTIStorage from '../../utils/storage';

const _first = 10;
const _next = 10;

class MyCollaborationsView extends Component {
  constructor(props) {
    super(props);
    this._onPressRow = this._onPressRow.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
  }

  _onPressRow(collaboration) {
    this.props.history.pushState(null, '/collaborations/' + collaboration.id);
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
      var me = this.props.me;
      if (me.originalProjects.edges.length > 0) {
        return (
          <div className="MyCollaborations-container">
            <ProjectListView projects={this.props.me.originalProjects} onPressRow={this._onPressRow} onEndReached={this._onEndReached}/>
          </div>
        );
      } else {
        return (
          <div>
            <MyCollaborationsPlaceholder />
          </div>
        );
      }
    } else {
      return (
        <div>
          <MyCollaborationsPlaceholder />
        </div>
      );
    }
  }
}

var MyCollaborationsContainer = Relay.createContainer(MyCollaborationsView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    me: () => Relay.QL`
    fragment on User {
      id
      originalProjects: collaborations(first: $first) {
        edges
        ${ProjectListView.getFragment('projects')},
      }
      moreProjects: collaborations(first: $moreFirst, after: $after) {
        ${ProjectListView.getFragment('projects')},
      }
    }
    `,
  },
});


module.exports = MyCollaborationsContainer;
