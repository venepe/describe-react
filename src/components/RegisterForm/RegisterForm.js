'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './RegisterForm.css';
import { RaisedButton, TextField, FlatButton } from 'material-ui';
import validator from 'validator';
import Utilities from '../../utils/utilities';
import Authenticate from '../../utils/authenticate';

const serverErrorMsg = 'Invalid email or password. Please try again';
const emailErrorMsg = 'Please enter a valid email address.';
const passwordErrorMsg = 'Password must be at least 6 characters long.';

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this._onChangeEmail = this._onChangeEmail.bind(this);
    this._onChangePassword = this._onChangePassword.bind(this);
    this._onRegister = this._onRegister.bind(this);

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
    let errorMessage = this.state.errorMessage;
    if (validator.isEmail(email)) {
      isEmailValid = true;
      if (errorMessage === emailErrorMsg) {
        errorMessage = '';
      }
    }

    this.setState({
      email,
      isEmailValid,
      errorMessage
    });
  }

  _onChangePassword(e) {
    let password = e.target.value;
    let isPasswordValid = false;
    let errorMessage = this.state.errorMessage;
    if (Utilities.isValidPassword(password)) {
      isPasswordValid = true;
      if (errorMessage === passwordErrorMsg) {
        errorMessage = '';
      }
    }
    this.setState({
      password,
      isPasswordValid,
      errorMessage
    });
  }

  _onRegister() {
    var password = this.state.password;
    var email = this.state.email.trim();
    if (!validator.isEmail(email)) {
      this.setState({
        errorMessage: emailErrorMsg
      });
    } else if (!Utilities.isValidPassword(password)) {
      this.setState({
        errorMessage: passwordErrorMsg
      });
    } else if(!this.state.isLoading) {
      this.setState({isLoading: true});
      Authenticate.register(email, password)
        .then((meId) => {
          this.props.onRegister(meId);
        })
        .catch((err) => {
          this.setState({
            errorMessage: serverErrorMsg,
            isLoading: false
          });
        });
    }
  }

  render() {
    let isDisabled = false;
    if (this.state.isLoading) {
      isDisabled = true;
    }

    return (
      <div className="RegisterForm">
        <div className="RegisterForm-container">
          <TextField floatingLabelText='Email' type='text' onChange={this._onChangeEmail} value={this.state.email} fullWidth={true} /> <br/>
          <TextField floatingLabelText='Password' type='password' onChange={this._onChangePassword} value={this.state.password} fullWidth={true} /> <br/>
          <RaisedButton primary={true} label="Sign up" fullWidth={true} disabled={isDisabled} onMouseUp={this._onRegister} onTouchEnd={this._onRegister} />
          <div className="error-text-container">
            <div className="error-text">{this.state.errorMessage}</div>
          </div>
        </div>
      </div>
    );
  }

}

RegisterForm.propTypes = {onRegister: PropTypes.func};
RegisterForm.defaultProps = {onRegister: function() {}};

export default RegisterForm;
