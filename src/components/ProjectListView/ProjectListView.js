'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Infinite from 'react-infinite';
import styles from './ProjectListView.css';
import { Card, CardTitle } from 'material-ui';
import ProjectCoverImage from '../ProjectCoverImage';
import SpinnerView from '../SpinnerView';

class ProjectListView extends Component {
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

  _onClick() {
    console.log('did click');
  }

  buildElements(projects) {
    return projects.edges.map(function (object, index) {
          let project = object.node;
          let projectComponent = (
            <Link key={index} to={`/projects/${project.id}`}>
              <Card className="clickable">
                <ProjectCoverImage projectCoverImage={project} />
                <CardTitle title={project.title} />
              </Card>
            </Link>
          );

         return projectComponent;
       }.bind(this));
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
      <Infinite elementHeight={468}
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

ProjectListView.propTypes = {onEndReached: PropTypes.func};
ProjectListView.defaultProps = {onEndReached: function() {}};

let ProjectListViewContainer = Relay.createContainer(ProjectListView, {
  fragments: {
    projects: () => Relay.QL`
      fragment on ProjectConnection {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            title
            ${ProjectCoverImage.getFragment('projectCoverImage')}
          }
        }
      }
    `,
  },
});



export default ProjectListViewContainer;
