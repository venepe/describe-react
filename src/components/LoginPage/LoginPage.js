/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.css';
import { RaisedButton, TextField, FlatButton } from 'material-ui';
import validator from 'validator';
import Utilities from '../../utils/utilities';
import Authenticate from '../../utils/authenticate';

const errorMessage = 'Invalid email or password. Please try again';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this._onChangeEmail = this._onChangeEmail.bind(this);
    this._onChangePassword = this._onChangePassword.bind(this);
    this._onLogin = this._onLogin.bind(this);
    this._pushForgot = this._pushForgot.bind(this);

    this.state = {
      email: '',
      password: '',
      keyboardSpace: 0,
      errorMessage: '',
      isEmailValid: false,
      isPasswordValid: false,
      isLoading: false
    }
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  _onChangeEmail(e) {
    var email = e.target.value;
    var isEmailValid = false;
    if (validator.isEmail(email)) {
      isEmailValid = true;
    }

    this.setState({
      email,
      isEmailValid
    });
  }

  _onChangePassword(e) {
    var password = e.target.value;
    var isPasswordValid = false;
    if (Utilities.isValidPassword(password)) {
      var isPasswordValid = true;
    }
    this.setState({
      password,
      isPasswordValid
    });
  }

  _onLogin() {
    var password = this.state.password;
    var email = this.state.email.trim();
    if (this.state.isEmailValid && this.state.isPasswordValid && !this.state.isLoading) {
      this.setState({isLoading: true});
      Authenticate.login(email, password)
        .then((meId) => {
          // this.props.onAuthenticated(meId);
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
    const title = 'Log In';
    this.context.onSetTitle(title);

    let isDisabled = true;
    if (this.state.isEmailValid && this.state.isPasswordValid && !this.state.isLoading) {
      isDisabled = false;
    }

    return (
      <div className="LoginPage">
        <div className="LoginPage-container">
          <h1>{title}</h1>
          <TextField floatingLabelText='Email' type='text' onChange={this._onChangeEmail} value={this.state.email} fullWidth={true} /> <br/>
          <TextField floatingLabelText='Password' type='password' onChange={this._onChangePassword} value={this.state.password} fullWidth={true} /> <br/>
          <RaisedButton disabled={isDisabled} label="Log in" fullWidth={true} disabled={isDisabled} onMouseUp={this._onLogin} onTouchEnd={this._onLogin} />
          <FlatButton label="Forgot Your Password?" onMouseUp={this._pushForgot} onTouchEnd={this._pushForgot} />
        </div>
      </div>
    );
  }

}

export default LoginPage;
