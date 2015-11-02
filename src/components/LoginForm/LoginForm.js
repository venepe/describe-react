'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './LoginForm.css';
import { RaisedButton, TextField, FlatButton } from 'material-ui';
import validator from 'validator';
import Utilities from '../../utils/utilities';
import Authenticate from '../../utils/authenticate';

const errorMessage = 'Invalid email or password. Please try again';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this._onChangeEmail = this._onChangeEmail.bind(this);
    this._onChangePassword = this._onChangePassword.bind(this);
    this._onLogin = this._onLogin.bind(this);
    this._onShowForgot = this._onShowForgot.bind(this);
    this._onShowRegister = this._onShowRegister.bind(this);

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
          this.props.onLogin(meId);
        })
        .catch((err) => {
          this.setState({
            errorMessage: errorMessage,
            isLoading: false
          });
        })
    }
  }

  _onShowForgot() {
    this.props.onShowForgot();
  }

  _onShowRegister() {
    this.props.onShowRegister();
  }

  render() {
    let isDisabled = true;
    if (this.state.isEmailValid && this.state.isPasswordValid && !this.state.isLoading) {
      isDisabled = false;
    }

    return (
      <div className="LoginForm">
        <div className="LoginForm-container">
          <TextField floatingLabelText='Email' type='text' onChange={this._onChangeEmail} value={this.state.email} fullWidth={true} /> <br/>
          <TextField floatingLabelText='Password' type='password' onChange={this._onChangePassword} value={this.state.password} fullWidth={true} /> <br/>
          <RaisedButton primary={true} disabled={isDisabled} label="Log in" fullWidth={true} disabled={isDisabled} onMouseUp={this._onLogin} onTouchEnd={this._onLogin} />
          <div className="forgot-button-container">
            <div className="error-text">{this.state.errorMessage}</div>
            <FlatButton secondary={true} label="Sign Up" onMouseUp={this._onShowRegister} onTouchEnd={this._onShowRegister} />
            <FlatButton secondary={true} label="Forgot Your Password?" onMouseUp={this._onShowForgot} onTouchEnd={this._onShowForgot} />
          </div>
        </div>
      </div>
    );
  }

}

LoginForm.propTypes = {onLogin: PropTypes.func, onShowRegister: PropTypes.func, onShowForgot: PropTypes.func};
LoginForm.defaultProps = {onLogin: function() {}, onShowRegister: function() {}, onShowForgot: function() {}};

export default LoginForm;
