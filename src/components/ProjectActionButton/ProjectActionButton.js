'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FloatingActionButton, IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import styles from './ProjectActionButton.css';
import { ProjectSheetOptions, CollaboratorProjectSheetOptions } from '../../constants/SheetOptions';
import TestCaseFormDialog from '../TestCaseFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';
import InviteeFormDialog from '../InviteeFormDialog';
import { hasUpdateNodePerm } from '../../utils/permissions';

import ModalTypes, { INTRODUCE_TEST_CASE, UPDATE_PROJECT, INTRODUCE_COLLABORATOR } from '../../constants/ModalTypes';

class ProjectActionButton extends Component {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props);
    this._buildMenuItem = this._buildMenuItem.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);

    this._dismissProjectUpdateForm = this._dismissProjectUpdateForm.bind(this);
    this._dismissTestCaseForm = this._dismissTestCaseForm.bind(this);
    this._dismissInviteeForm = this._dismissInviteeForm.bind(this);
    this.state = {
      showProjectUpdateForm: false,
      showTestCaseForm: false,
      showInviteeForm: false
    }
  }

  _buildMenuItem() {
    if (hasUpdateNodePerm(this.props.project.permission)) {
      return ProjectSheetOptions.options.map(function (object, index) {
        let menuItem = (
          <MenuItem key={index} primaryText={object.text} value={object.value} />
        );
       return menuItem;
     }.bind(this));
    } else {
      return CollaboratorProjectSheetOptions.options.map(function (object, index) {
        let menuItem = (
          <MenuItem key={index} primaryText={object.text} value={object.value} />
        );
       return menuItem;
     }.bind(this));
    }
  }

  _onItemTouchTap(event, item) {
    switch (item.props.value) {
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
      case INTRODUCE_COLLABORATOR:
        this.setState({
          showInviteeForm: true
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

  _dismissInviteeForm() {
    this.setState({
      showInviteeForm: false
    });
  }

  render() {
    let iconButtonElement = (<FloatingActionButton><FontIcon className="material-icons">add</FontIcon></FloatingActionButton>);
    // let iconButtonElement = (<IconButton style={{width: '24px', padding: '0px'}}><FontIcon className="material-icons" color={Styles.Colors.grey600}>add</FontIcon></IconButton>);

    return (
      <div className="project-action-button">
          <IconMenu className={'icon-menu'} iconButtonElement={iconButtonElement} openDirection={'top-left'} onItemTouchTap={this._onItemTouchTap}>
            {this._buildMenuItem()}
            <Divider />
            <MenuItem primaryText="Close" />
          </IconMenu>
          <ProjectUpdateFormDialog isVisible={this.state.showProjectUpdateForm} project={this.props.project} onCancel={this._dismissProjectUpdateForm} onUpdate={this._dismissProjectUpdateForm} />
          <TestCaseFormDialog isVisible={this.state.showTestCaseForm} project={this.props.project} onCancel={this._dismissTestCaseForm} onCreate={this._dismissTestCaseForm} />
          <InviteeFormDialog isVisible={this.state.showInviteeForm} project={this.props.project} me={this.props.me} onCancel={this._dismissInviteeForm} onCreate={this._dismissInviteeForm} />
      </div>
    );
  }
}

export default Relay.createContainer(ProjectActionButton, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        permission
        ${ProjectUpdateFormDialog.getFragment('project')},
        ${TestCaseFormDialog.getFragment('project')},
        ${InviteeFormDialog.getFragment('project')}
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${InviteeFormDialog.getFragment('me')}
      }
    `,
  },
});
