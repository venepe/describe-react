'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaborationText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import SheetOptions from '../../constants/SheetOptions';
import TestCaseFormDialog from '../TestCaseFormDialog';

import ModalTypes, { INTRODUCE_TEST_CASE, LEAVE_PROJECT } from '../../constants/ModalTypes';

import DeleteCollaborationMutation from '../../mutations/DeleteCollaborationMutation';

class CollaborationText extends Component {
  constructor(props) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissTestCaseForm = this._dismissTestCaseForm.bind(this);
    this.state = {
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
        case LEAVE_PROJECT:
            this.props.onDelete(this.props.collaboration.id);
            Relay.Store.update(
              new DeleteCollaborationMutation({collaboration: this.props.collaboration, me: this.props.me})
            );
          break;
      default:
    }
  }

  _dismissTestCaseForm() {
    this.setState({
      showTestCaseForm: false
    });
  }

  render() {

    return (
      <div className="CollaborationText-container">
        <ModalableArchyLabel text={this.props.collaboration.title} sheetOptions={SheetOptions.collaborativeProjectSheet} onItemTouchTap={this._onItemTouchTap} />
        <TestCaseFormDialog isVisible={this.state.showTestCaseForm} project={this.props.collaboration} onCancel={this._dismissTestCaseForm} onCreate={this._dismissTestCaseForm} />
      </div>
    );
  }
}

CollaborationText.propTypes = {onClick: PropTypes.func, onDelete: PropTypes.func};
CollaborationText.defaultProps = {onClick: function() {}, onDelete: function() {}};

var CollaborationTextContainer = Relay.createContainer(CollaborationText, {
  fragments: {
    collaboration: () => Relay.QL`
      fragment on Project {
        id
        title
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

module.exports = CollaborationTextContainer;
