'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectListCellView.css';
import { Card, CardTitle, CardText } from 'material-ui';
import { ProjectListCellSheetOptions } from '../../constants/SheetOptions';
import CollaboratorIcon from '../CollaboratorIcon';
import SettingsButton from '../SettingsButton';
import ConfirmationDialog from '../ConfirmationDialog';

import ModalTypes, { DELETE_PROJECT } from '../../constants/ModalTypes';

import { DeleteProjectMutation } from '../../mutations';
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
    this._onDelete = this._onDelete.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this.renderBuiltWith = this.renderBuiltWith.bind(this);
    this._onStopPropogation = this._onStopPropogation.bind(this);
    this.state = {
      showConfirmationDialog: false
    }
  }

  _onClick() {
    this.props.onClick(this.props.project);
  }

  _onItemTouchTap(value) {
    switch (value) {
        case DELETE_PROJECT:
            this.setState({
              showConfirmationDialog: true
            });
          break;
      default:
    }
  }

  _dismissConfirmationDialog() {
    this.setState({
      showConfirmationDialog: false
    });
  }

  _onDelete() {
    this._dismissConfirmationDialog();
    Relay.Store.commitUpdate(
      new DeleteProjectMutation({project: this.props.project, me: this.props.me})
    );
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

  _onStopPropogation(e) {
    e.stopPropagation();
  }

  render() {
    let project = this.props.project;
    let percentFulfilled = parseInt(project.numOfTestCasesFulfilled / project.numOfTestCases * 100) || 0;
    let color = percentFulfilled < 50 ? '#FF5252' : percentFulfilled < 80 ? '#FFD740' : '#69F0AE';

    let subtitleText = `${project.numOfTestCasesFulfilled}/${project.numOfTestCases}`;
    let subtitle = (<div><div style={{float: 'left', paddingBottom: 16}}>{subtitleText}</div>{this.renderBuiltWith()}<div style={{float: 'right', paddingBottom: 16, fontSize: 18, color}}>{percentFulfilled}%</div></div>)
    return (
      <Card key={this.props.key} className="clickable" onClick={this._onClick}>
        <div className="settings-btn" onClick={this._onStopPropogation}>
          <SettingsButton sheetOptions={ProjectListCellSheetOptions} onItemTouchTap={this._onItemTouchTap} />
        </div>
        <CardTitle title={project.text} subtitle={subtitle} style={{padding: '0px', margin: '16px'}} />
        <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Delete Project?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onDelete} />
      </Card>
    );
  }
}

export default Relay.createContainer(ProjectListCellView, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        text
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
        ${DeleteProjectMutation.getFragment('project')},
        ${DidDeleteProjectSubscription.getFragment('project')},
        ${DidUpdateProjectSubscription.getFragment('project')},
        ${DidIntroduceCollaboratorSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DeleteProjectMutation.getFragment('me')},
        ${DidDeleteProjectSubscription.getFragment('me')},
      }
    `,
  },
});
