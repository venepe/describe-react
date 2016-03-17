'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import { ProjectSheetOptions } from '../../constants/SheetOptions';
import TestCaseFormDialog from '../TestCaseFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';
import CollaboratorFormDialog from '../CollaboratorFormDialog';

import ModalTypes, { INTRODUCE_COLLABORATOR, INTRODUCE_TEST_CASE, UPDATE_PROJECT, DELETE_PROJECT } from '../../constants/ModalTypes';

import { DeleteProjectMutation } from '../../mutations';

class ProjectText extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    onClick: function() {},
    onDelete: function() {}
  }

  constructor(props) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissProjectUpdateForm = this._dismissProjectUpdateForm.bind(this);
    this._dismissTestCaseForm = this._dismissTestCaseForm.bind(this);
    this._dismissCollaboratorForm = this._dismissCollaboratorForm.bind(this);
    this.state = {
      showProjectUpdateForm: false,
      showTestCaseForm: false,
      showCollaboratorForm: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onItemTouchTap(value) {
    switch (value) {
      case INTRODUCE_TEST_CASE:
          this.setState({
            showTestCaseForm: true
          });
        break;
        case INTRODUCE_COLLABORATOR:
            this.setState({
              showCollaboratorForm: true
            });
          break;
        case UPDATE_PROJECT:
            this.setState({
              showProjectUpdateForm: true
            });
          break;
        case DELETE_PROJECT:
            this.props.onDelete(this.props.project.id);
            Relay.Store.commitUpdate(
              new DeleteProjectMutation({project: this.props.project, me: this.props.me})
            );
          break;
      default:
    }
  }

  _dismissProjectUpdateForm() {
    this.setState({
      showProjectUpdateForm: false
    });
  }

  _dismissTestCaseForm() {
    this.setState({
      showTestCaseForm: false
    });
  }

  _dismissCollaboratorForm() {
    this.setState({
      showCollaboratorForm: false
    });
  }

  render() {

    return (
      <div className="ProjectText-container">
        <ModalableArchyLabel text={this.props.project.title} sheetOptions={ProjectSheetOptions} onItemTouchTap={this._onItemTouchTap} />
        <ProjectUpdateFormDialog isVisible={this.state.showProjectUpdateForm} project={this.props.project} onCancel={this._dismissProjectUpdateForm} onUpdate={this._dismissProjectUpdateForm} />
        <TestCaseFormDialog isVisible={this.state.showTestCaseForm} project={this.props.project} onCancel={this._dismissTestCaseForm} onCreate={this._dismissTestCaseForm} />
        <CollaboratorFormDialog isVisible={this.state.showCollaboratorForm} project={this.props.project} onCancel={this._dismissCollaboratorForm} onCreate={this._dismissCollaboratorForm} />
      </div>
    );
  }
}

export default Relay.createContainer(ProjectText, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        title
        ${ProjectUpdateFormDialog.getFragment('project')},
        ${TestCaseFormDialog.getFragment('project')},
        ${CollaboratorFormDialog.getFragment('project')},
        ${DeleteProjectMutation.getFragment('project')}
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DeleteProjectMutation.getFragment('me')}
      }
    `,
  },
});
