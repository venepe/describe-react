'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectListCellView.css';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';

import DidDeleteProjectSubscription from '../../subscriptions/DidDeleteProjectSubscription';

class ProjectListCellView extends Component {
  static propTypes = {
    key: PropTypes.number,
    onClick: PropTypes.func
  }

  static defaultProps = {
    key: 0,
    onClick: function() {}
  }

  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.props.project);
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prevProps) {
    this.subscribe(prevProps);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe() {
    if (!this.projectSubscription) {
      this.projectSubscription = Relay.Store.subscribe(
        new DidDeleteProjectSubscription({project: this.props.project, me: this.props.me})
      );
    }
  }

  unsubscribe() {
    if (this.projectSubscription) {
      this.projectSubscription.dispose();
    }
  }

  render() {
    let project = this.props.project;
    let uri = ''
    if (project.coverImages && project.coverImages.edges.length > 0) {
      uri = project.coverImages.edges[0].node.uri;
    }
    let subtitle = `${project.numOfTestCasesFulfilled}/${project.numOfTestCases}`;
    return (
      <Card key={this.props.key} className="clickable" onClick={this._onClick}>
        <div>
          <CardMedia className='CoverImage-container' expandable={true}>
            <img className='CoverImage-img' height={400} src={uri} />
          </CardMedia>
        </div>
        <CardTitle title={project.title} subtitle={subtitle} />
      </Card>
    );
  }
}

export default Relay.createContainer(ProjectListCellView, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
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
        ${DidDeleteProjectSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DidDeleteProjectSubscription.getFragment('me')},
      }
    `,
  },
});
