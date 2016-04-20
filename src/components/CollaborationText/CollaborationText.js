'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaborationText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import { CollaborativeProjectSheetOptions } from '../../constants/SheetOptions';
import TestCaseFormDialog from '../TestCaseFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';

import ModalTypes, { INTRODUCE_TEST_CASE, UPDATE_PROJECT, LEAVE_PROJECT } from '../../constants/ModalTypes';

import { DeleteCollaborationMutation } from '../../mutations';

class CollaborationText extends Component {
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
    this._onClick = this._onClick.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissProjectUpdateForm = this._dismissProjectUpdateForm.bind(this);
    this._dismissTestCaseForm = this._dismissTestCaseForm.bind(this);
    this.state = {
      showTestCaseForm: false,
      showProjectUpdateForm: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.props.collaboration.id);
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
        case LEAVE_PROJECT:
            this.props.onDelete(this.props.collaboration.id);
            Relay.Store.commitUpdate(
              new DeleteCollaborationMutation({collaboration: this.props.collaboration, me: this.props.me})
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
      <div className="CollaborationText-container">
        <ModalableArchyLabel text={this.props.collaboration.title} sheetOptions={CollaborativeProjectSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
          <ProjectUpdateFormDialog isVisible={this.state.showProjectUpdateForm} project={this.props.collaboration} onCancel={this._dismissProjectUpdateForm} onUpdate={this._dismissProjectUpdateForm} />
          <TestCaseFormDialog isVisible={this.state.showTestCaseForm} project={this.props.collaboration} onCancel={this._dismissTestCaseForm} onCreate={this._dismissTestCaseForm} />
      </div>
    );
  }
}

export default Relay.createContainer(CollaborationText, {
  fragments: {
    collaboration: () => Relay.QL`
      fragment on Project {
        id
        title
        ${ProjectUpdateFormDialog.getFragment('project')},
        ${TestCaseFormDialog.getFragment('project')},
        ${DeleteCollaborationMutation.getFragment('collaboration')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
        ${DeleteCollaborationMutation.getFragment('me')},
      }
    `,
  },
});
