'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './ResetForm.css';
import { RaisedButton, TextField, FlatButton } from 'material-ui';
import validator from 'validator';
import Utilities from '../../utils/utilities';
import Authenticate from '../../utils/authenticate';

const errorMessage = 'Invalid password. Please try again';

class ResetForm extends Component {
  static propTypes = {
    onReset: PropTypes.func
  }

  static defaultProps = {
    onReset: function() {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onChangePassword = this._onChangePassword.bind(this);
    this._onReset = this._onReset.bind(this);
    this._dismissForm = this._dismissForm.bind(this);

    this.state = {
      id: props.location.query.id,
      token: props.location.query.token,
      password: '',
      errorMessage: '',
      isPasswordValid: false,
      isLoading: false,
      didReset: false
    }
  }

  _onChangePassword(e) {
    let password = e.target.value;
    let isPasswordValid = false;
    if (Utilities.isValidPassword(password)) {
      isPasswordValid = true;
    }
    this.setState({
      password,
      isPasswordValid
    });
  }

  _onReset() {
    let id = this.state.id;
    let token = this.state.token;
    let password = this.state.password;
    if (this.state.isPasswordValid && !this.state.isLoading) {
      this.setState({isLoading: true});
      Authenticate.reset(token, id, password)
        .then(() => {
          this.setState({
            didReset: true,
            isLoading: false
          })
        })
        .catch((err) => {
          this.setState({
            errorMessage: errorMessage,
            isLoading: false
          });
        })
    }
  }

  _dismissForm() {
    this.router.replace('/');
  }

  render() {
    let isDisabled = true;
    if (this.state.isPasswordValid && !this.state.isLoading) {
      isDisabled = false;
    }

    if (!this.state.didReset) {
      return (
        <div className="ResetForm">
          <div className="ResetForm-container">
            <TextField floatingLabelText='Password' type='password' onChange={this._onChangePassword} value={this.state.password} fullWidth={true} /> <br/>
            <RaisedButton primary={true} disabled={isDisabled} label="Reset" fullWidth={true} disabled={isDisabled} onMouseUp={this._onReset} onTouchEnd={this._onReset} />
            <div className="error-text-container">
              <div className="error-text">{this.state.errorMessage}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="success-message-container">
          <div className="success-message">Your password was successfully reset.</div>
          <div className="success-message">Go ahead and login.</div>
          <RaisedButton primary={true} label="Okay" fullWidth={true} onMouseUp={this._dismissForm} onTouchEnd={this._dismissForm} />
        </div>
      );
    }
  }

}

export default ResetForm;
