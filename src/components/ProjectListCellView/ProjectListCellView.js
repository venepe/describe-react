'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectListCellView.css';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';
import CollaboratorIcon from '../CollaboratorIcon';

import { registerDidIntroduceCollaborator, registerDidDeleteProject, registerDidUpdateProject } from '../../stores/SubscriptionStore';
import { DidIntroduceCollaboratorSubscription, DidDeleteProjectSubscription, DidUpdateProjectSubscription } from '../../subscriptions';

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

      registerDidIntroduceCollaborator({projectId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceCollaboratorSubscription({project})
        );
      });
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
        return(<CollaboratorIcon key={index} collaborator={collaborator} project={project} />)
      });
    } else {
      return [];
    }
  }

  render() {
    let project = this.props.project;
    let percentFulfilled = parseInt(project.numOfTestCasesFulfilled / project.numOfTestCases * 100) || 0;
    let color = percentFulfilled < 79 ? '#FF5252' : percentFulfilled < 100 ? '#FFD740' : '#69F0AE';

    let subtitleText = `${project.numOfTestCasesFulfilled}/${project.numOfTestCases}`;
    let subtitle = (<div><div style={{float: 'left', paddingBottom: 16}}>{subtitleText}</div>{this.renderBuiltWith()}<div style={{float: 'right', paddingBottom: 16, fontSize: 18, color}}>{percentFulfilled}%</div></div>)
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
              ${CollaboratorIcon.getFragment('collaborator')}
            }
          }
        }
        ${CollaboratorIcon.getFragment('project')},
        ${DidDeleteProjectSubscription.getFragment('project')},
        ${DidUpdateProjectSubscription.getFragment('project')},
        ${DidIntroduceCollaboratorSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DidDeleteProjectSubscription.getFragment('me')},
      }
    `,
  },
});
