'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Infinite from 'react-infinite';
import styles from './ProjectListView.css';
import { Card, CardTitle } from 'material-ui';
import ProjectCoverImage from '../ProjectCoverImage';

class ProjectListView extends Component {
  constructor(props) {
    super(props);
    this._getInitialState = this._getInitialState.bind(this);
    this.buildElements = this.buildElements.bind(this);
    this._onClick = this._onClick.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      isInfiniteLoading: false,
      elements: this.buildElements()
    };
  }

  _onClick() {
    console.log('did click');
  }

  buildElements() {
    return this.props.projects.edges.map(function (object, index) {
          var project = object.node;
          var projectComponent = (
            <Link to={`/projects/${project.id}`}>
              <Card className="clickable">
                <ProjectCoverImage projectCoverImage={project} />
                <CardTitle title={project.title} />
              </Card>
            </Link>
          );

         return projectComponent;
       }.bind(this));
  }

  handleInfiniteLoad() {
    console.log('load more');
  }

  elementInfiniteLoad() {
      return (
          <div className="infinite-list-item">
            Loading...
          </div>
      );
  }

  render() {
    return (
      <Infinite elementHeight={468}
                       containerHeight={window.screen.height}
                       infiniteLoadBeginBottomOffset={200}
                       onInfiniteLoad={this.handleInfiniteLoad}
                       loadingSpinnerDelegate={this.elementInfiniteLoad()}
                       isInfiniteLoading={this.state.isInfiniteLoading}
                       useWindowAsScrollContainer={true}
                       >
          {this.state.elements}
      </Infinite>
    );
  }
}

var ProjectListViewContainer = Relay.createContainer(ProjectListView, {
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
