'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Infinite from 'react-infinite';
import styles from './ProjectListView.css';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';
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

  _onClick(project) {
    this.props.onPressRow(project);
  }

  buildElements(projects) {
    return projects.edges.map(function (object, index) {
          let project = object.node;
          let uri = ''
          if (project.coverImages && project.coverImages.edges.length > 0) {
            uri = project.coverImages.edges[0].node.uri;
          }
          let subtitle = `${project.numOfTestCasesFulfilled}/${project.numOfTestCases}`;
          let projectComponent = (
            <Card key={index} className="clickable" onClick={() => this._onClick(project)}>
              <div>
                <CardMedia className='CoverImage-container' expandable={true}>
                  <img className='CoverImage-img' height={400} src={uri} />
                </CardMedia>
              </div>
              <CardTitle title={project.title} subtitle={subtitle} />
            </Card>
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

ProjectListView.propTypes = {onPressRow: PropTypes.func, onEndReached: PropTypes.func};
ProjectListView.defaultProps = {onPressRow: function() {}, onEndReached: function() {}};

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
            numOfTestCases
            numOfTestCasesFulfilled
            coverImages(first: 1) {
              edges {
                node {
                  uri
                }
              }
            }
          }
        }
      }
    `,
  },
});



export default ProjectListViewContainer;
