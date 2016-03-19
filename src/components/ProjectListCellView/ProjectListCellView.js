'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectListCellView.css';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';
import { isClientID } from '../../utils/isClientID';

import { DidDeleteProjectSubscription, DidUpdateProjectSubscription } from '../../subscriptions';

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

  subscribe(prevProps = {}) {
    if(!isClientID(this.props.project.id)) {
      if (prevProps.project !== undefined && prevProps.project.id !== this.props.project.id) {
        this.unsubscribe();
      }

      if (!this.projectSubscriptionDelete) {
        this.projectSubscriptionDelete = Relay.Store.subscribe(
          new DidDeleteProjectSubscription({project: this.props.project, me: this.props.me})
        );
      }

      if (!this.projectSubscriptionUpdate) {
        this.projectSubscriptionUpdate = Relay.Store.subscribe(
          new DidUpdateProjectSubscription({project: this.props.project})
        );
      }
    }
  }

  unsubscribe() {
    if (this.projectSubscriptionDelete) {
      this.projectSubscriptionDelete.dispose();
      this.projectSubscriptionDelete = null;
    }

    if (this.projectSubscriptionUpdate) {
      this.projectSubscriptionUpdate.dispose();
      this.projectSubscriptionUpdate = null;
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
        coverImages(last: 1) {
          edges {
            node {
              uri
            }
          }
        }
        ${DidDeleteProjectSubscription.getFragment('project')},
        ${DidUpdateProjectSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DidDeleteProjectSubscription.getFragment('me')},
      }
    `,
  },
});
