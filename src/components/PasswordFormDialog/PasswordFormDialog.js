'use strict';

import React, { PropTypes, Component } from 'react';
import { FlatButton, TextField, Dialog } from 'material-ui';
import styles from './PasswordFormDialog.css';
import { isValidPassword } from '../../utils/utilities';
import Authenticate from '../../utils/authenticate';
const serverErrorMsg = 'Invalid. Please try again';

class PasswordFormDialog extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onCreate: PropTypes.func
  }

  static defaultProps = {
    onCancel: function() {},
    onCreate: function() {}
  }

  constructor(props) {
    super(props);
    this._onChangeCurrentPassword = this._onChangeCurrentPassword.bind(this);
    this._onChangeNewPassword = this._onChangeNewPassword.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this._getInitialState = this._getInitialState.bind(this);

    this.state = this._getInitialState();

  }

  _getInitialState() {
    return {
      current: '',
      new: '',
      errorMessage: '',
      isCurrentPasswordValid: false,
      isNewPasswordValid: false,
      isOpened: false
    };
  }

  _onChangeCurrentPassword(e) {
    let password = e.target.value;
    let isPasswordValid = isValidPassword(password);
    this.setState({
      current: password,
      isCurrentPasswordValid: isPasswordValid,
      errorMessage: ''
    });
  }

  _onChangeNewPassword(e) {
    let password = e.target.value;
    let isPasswordValid = isValidPassword(password);
    this.setState({
      new: password,
      isNewPasswordValid: isPasswordValid,
      errorMessage: ''
    });
  }

  _onSubmit() {
    let currentPassword = this.state.current;
    let newPassword = this.state.new;
    if (this.state.isNewPasswordValid && this.state.isCurrentPasswordValid) {
      Authenticate.password(currentPassword, newPassword)
        .then(() => {
          this.dismiss();
        })
        .catch((err) => {
          this.setState({
            errorMessage: serverErrorMsg
          });
        });
    } else {
      this.setState({
        errorMessage: passwordErrorMsg
      });
    }
  }

  dismiss() {
    this.setState(this._getInitialState());
  }

  render() {
    return (
      <Dialog ref="dialog"
        title="Change Password"
        open={this.state.isOpened}
        onRequestClose={this.dismiss}
        modal={false}>
        <div>
          <div>
            <TextField hintText={'Current Password'} type='password' onChange={this._onChangeCurrentPassword} value={this.state.current} fullWidth={true} /> <br/>
            <TextField hintText={'New Password'} type='password' onChange={this._onChangeNewPassword} value={this.state.new} fullWidth={true} /> <br/>
          </div>
          <div className="action-container">
            <div className="error-text">{this.state.errorMessage}</div>
            <FlatButton label="Cancel" secondary={true} onTouchTap={this.dismiss} />
            <FlatButton label="Submit" disabled={!(this.state.isNewPasswordValid && this.state.isCurrentPasswordValid)} primary={true} onTouchTap={this._onSubmit} />
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

export default PasswordFormDialog;
