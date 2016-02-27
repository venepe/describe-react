'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { Dialog, FlatButton } from 'material-ui';
import styles from './UserDeleteDialog.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';

import IntroduceTestCaseMutation from '../../mutations/IntroduceTestCaseMutation';

class UserDeleteDialog extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    onCancel: function() {},
    onDelete: function() {}
  }

  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onDelete = this._onDelete.bind(this);

    this.state = {
      isOpened: false
    }
  }

  _onDelete() {
    this.setState({
      isOpened: false
    });
    this.props.onDelete();
  }

  _onCancel() {
    this.setState({
      isOpened: false
    });
    this.props.onCancel();
  }

  render() {
    return (
      <Dialog ref="dialog"
        title="Delete Your Account?"
        open={this.state.isOpened}
        modal={false}>
        <div>
          <div className="text">Deleting your account will also delete your projects.</div>
          <div className="action-container">
            <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancel} />
            <FlatButton label="Delete" primary={true} onTouchTap={this._onDelete} />
          </div>
        </div>
      </Dialog>
    );
  }

  show() {
    this.setState({
      isOpened: true
    });
  }
}

export default UserDeleteDialog;
