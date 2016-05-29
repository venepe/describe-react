'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { IconButton, FontIcon, Styles } from 'material-ui';
import styles from './ProjectText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import { ProjectSheetOptions } from '../../constants/SheetOptions';
import TestCaseFormDialog from '../TestCaseFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';
import ConfirmationDialog from '../ConfirmationDialog';

import ModalTypes, { INTRODUCE_TEST_CASE, UPDATE_PROJECT, DELETE_PROJECT } from '../../constants/ModalTypes';

import { DeleteProjectMutation } from '../../mutations';

class ProjectText extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    onClick: function() {},
    onDelete: function() {}
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onClick = this._onClick.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissProjectUpdateForm = this._dismissProjectUpdateForm.bind(this);
    this._dismissTestCaseForm = this._dismissTestCaseForm.bind(this);
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this._pushMessages = this._pushMessages.bind(this);
    this.state = {
      showProjectUpdateForm: false,
      showTestCaseForm: false,
      showConfirmationDialog: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.props.project.id);
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
        this.setState({
          showConfirmationDialog: true
        });
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

  _dismissConfirmationDialog() {
    this.setState({
      showConfirmationDialog: false
    });
  }

  _pushMessages() {
    let channelId = this.props.project.id;
    this.router.push(`/channels/${channelId}/messages`);
  }

  _onDelete() {
    this._dismissConfirmationDialog();
    this.props.onDelete(this.props.project.id);
    Relay.Store.commitUpdate(
      new DeleteProjectMutation({project: this.props.project, me: this.props.me})
    );
  }

  render() {
    return (
      <div className="ProjectText-container">
        <ModalableArchyLabel text={this.props.project.title} sheetOptions={ProjectSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
        <ProjectUpdateFormDialog isVisible={this.state.showProjectUpdateForm} project={this.props.project} onCancel={this._dismissProjectUpdateForm} onUpdate={this._dismissProjectUpdateForm} />
        <TestCaseFormDialog isVisible={this.state.showTestCaseForm} project={this.props.project} onCancel={this._dismissTestCaseForm} onCreate={this._dismissTestCaseForm} />
        <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Delete Project?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onDelete} />
        <div className="message">
          <IconButton style={{width: '24px', padding: '0px'}} onMouseUp={this._pushMessages} onTouchEnd={this._pushMessages}><FontIcon className="material-icons" color={Styles.Colors.grey600}>chat_bubble</FontIcon></IconButton>
        </div>
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
        ${DeleteProjectMutation.getFragment('project')}
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
        ${DeleteProjectMutation.getFragment('me')}
      }
    `,
  },
});
