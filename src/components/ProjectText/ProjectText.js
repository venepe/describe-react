'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import SheetOptions from '../../constants/SheetOptions';
import TestCaseFormDialog from '../TestCaseFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';

import ModalTypes, { INTRODUCE_TEST_CASE, UPDATE_PROJECT, DELETE_PROJECT } from '../../constants/ModalTypes';

import DeleteProjectMutation from '../../mutations/DeleteProjectMutation';

class ProjectText extends Component {
  constructor(props) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissProjectUpdateForm = this._dismissProjectUpdateForm.bind(this);
    this._dismissTestCaseForm = this._dismissTestCaseForm.bind(this);
    this.state = {
      showProjectUpdateForm: false,
      showTestCaseForm: false
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
        case UPDATE_PROJECT:
            this.setState({
              showProjectUpdateForm: true
            });
          break;
        case DELETE_PROJECT:
            this.props.onDelete(this.props.project.id);
            Relay.Store.update(
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

  render() {

    return (
      <div className="ProjectText-container">
        <ModalableArchyLabel text={this.props.project.title} sheetOptions={SheetOptions.projectSheet} onItemTouchTap={this._onItemTouchTap} />
        <ProjectUpdateFormDialog isVisible={this.state.showProjectUpdateForm} project={this.props.project} onCancel={this._dismissProjectUpdateForm} onUpdate={this._dismissProjectUpdateForm} />
        <TestCaseFormDialog isVisible={this.state.showTestCaseForm} project={this.props.project} onCancel={this._dismissTestCaseForm} onCreate={this._dismissTestCaseForm} />
      </div>
    );
  }
}

ProjectText.propTypes = {onClick: PropTypes.func, onDelete: PropTypes.func};
ProjectText.defaultProps = {onClick: function() {}, onDelete: function() {}};

var ProjectTextContainer = Relay.createContainer(ProjectText, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        title
        ${ProjectUpdateFormDialog.getFragment('project')},
        ${TestCaseFormDialog.getFragment('project')},
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

module.exports = ProjectTextContainer;
