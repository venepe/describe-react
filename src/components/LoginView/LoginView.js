'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './LoginView.css';
import { RaisedButton, TextField, FlatButton } from 'material-ui';
import validator from 'validator';
import Utilities from '../../utils/utilities';
import Authenticate from '../../utils/authenticate';

const errorMessage = 'Invalid email or password. Please try again';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this._onChangeEmail = this._onChangeEmail.bind(this);
    this._onChangePassword = this._onChangePassword.bind(this);
    this._onLogin = this._onLogin.bind(this);
    this._pushForgot = this._pushForgot.bind(this);

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      isEmailValid: false,
      isPasswordValid: false,
      isLoading: false
    }
  }

  _onChangeEmail(e) {
    let email = e.target.value;
    let isEmailValid = false;
    if (validator.isEmail(email)) {
      isEmailValid = true;
    }

    this.setState({
      email,
      isEmailValid
    });
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

  _onLogin() {
    let password = this.state.password;
    let email = this.state.email.trim();
    if (this.state.isEmailValid && this.state.isPasswordValid && !this.state.isLoading) {
      this.setState({isLoading: true});
      Authenticate.login(email, password)
        .then((meId) => {
          this.props.history.pushState(null, '/myprojects');
        })
        .catch((err) => {
          this.setState({
            errorMessage: errorMessage,
            isLoading: false
          });
        })
    }
  }

  _pushForgot() {
  }

  render() {
    let isDisabled = true;
    if (this.state.isEmailValid && this.state.isPasswordValid && !this.state.isLoading) {
      isDisabled = false;
    }

    return (
      <div className="LoginView">
        <div className="LoginView-container">
          <TextField floatingLabelText='Email' type='text' onChange={this._onChangeEmail} value={this.state.email} fullWidth={true} /> <br/>
          <TextField floatingLabelText='Password' type='password' onChange={this._onChangePassword} value={this.state.password} fullWidth={true} /> <br/>
          <RaisedButton disabled={isDisabled} label="Log in" fullWidth={true} disabled={isDisabled} onMouseUp={this._onLogin} onTouchEnd={this._onLogin} />
          <FlatButton label="Forgot Your Password?" onMouseUp={this._pushForgot} onTouchEnd={this._pushForgot} />
        </div>
      </div>
    );
  }

}

export default LoginView;
