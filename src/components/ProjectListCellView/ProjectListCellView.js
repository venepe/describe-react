'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectListCellView.css';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';

import { registerDidDeleteProject, registerDidUpdateProject } from '../../stores/SubscriptionStore';
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
    this.renderBuiltWith = this.renderBuiltWith.bind(this);
  }

  _onClick() {
    this.props.onClick(this.props.project);
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.project && this.props.me) {
      let project = this.props.project;
      let me = this.props.me;
      let projectId = project.id;
      let meId = me.id;

      registerDidUpdateProject({projectId}, () => {
        return Relay.Store.subscribe(
          new DidUpdateProjectSubscription({project})
        );
      });
      registerDidDeleteProject({projectId, meId}, () => {
        return Relay.Store.subscribe(
          new DidDeleteProjectSubscription({project, me})
        );
      });
    }
  }

  renderBuiltWith() {
    let project = this.props.project;
    if (project.collaborators && project.collaborators.edges.length > 0) {
      return project.collaborators.edges.map(function (object, index) {
        let collaborator = object.node;
        return(<img style={{float: 'left', marginLeft: 10, borderRadius: '50%',}} height={20} width={20} src={collaborator.profile.cover.uri} />)
      });
    } else {
      return [];
    }
  }

  render() {
    let project = this.props.project;
    let subtitleText = `${project.numOfTestCasesFulfilled}/${project.numOfTestCases}`;
    let subtitle = (<div><div style={{float: 'left', paddingBottom: 16}}>{subtitleText}</div>{this.renderBuiltWith()}</div>)
    return (
      <Card key={this.props.key} className="clickable" onClick={this._onClick}>
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
        collaborators (first: 5) {
          edges {
            node {
              profile {
                cover {
                  id
                  uri
                }
              }
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
