'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import Infinite from 'react-infinite';
import styles from './ProjectListView.css';
import ProjectListCellView from '../ProjectListCellView';
import SpinnerView from '../SpinnerView';

class ProjectListView extends Component {
  static propTypes = {
    onPressRow: PropTypes.func,
    onEndReached: PropTypes.func
  }

  static defaultProps = {
    onPressRow: function() {},
    onEndReached: function() {}
  }

  constructor(props) {
    super(props);
    this._getInitialState = this._getInitialState.bind(this);
    this.buildElements = this.buildElements.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onEndReached = this._onEndReached.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      hasNextPage: false,
      elements: this.buildElements(this.props.projects)
    };
  }

  _getUpdatedState(projects) {
    return {
      hasNextPage: false,
      elements: this.buildElements(projects)
    };
  }

  _onClick(project) {
    this.props.onPressRow(project);
  }

  buildElements(projects) {
    return projects.edges.map(function (object, index) {
      let project = object.node;
      let projectComponent = this.buildElement(project, index);
      return projectComponent;
    }.bind(this));
  }

  buildElement(project, index) {
    return (
      <ProjectListCellView project={project} me={this.props.me} key={index} onClick={this._onClick}></ProjectListCellView>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projects) {
      this.setState(this._getUpdatedState(nextProps.projects));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.projects.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.projects.edges;
    if (edges.length > 0) {
      this.props.onEndReached(edges[edges.length - 1].cursor);
    }
  }

  elementInfiniteLoad() {
      return (
          <SpinnerView />
      );
  }

  render() {
    return (
      <Infinite elementHeight={84}
                       containerHeight={window.screen.height}
                       infiniteLoadBeginBottomOffset={200}
                       onInfiniteLoad={this._onEndReached}
                       loadingSpinnerDelegate={this.elementInfiniteLoad()}
                       isInfiniteLoading={this.state.hasNextPage}
                       useWindowAsScrollContainer={true}
                       >
          {this.state.elements}
      </Infinite>
    );
  }
}

export default Relay.createContainer(ProjectListView, {
  fragments: {
    projects: () => Relay.QL`
      fragment on ProjectConnection {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            ${ProjectListCellView.getFragment('project')},
          }
        }
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${ProjectListCellView.getFragment('me')},
      }
    `,
  },
});
