'use strict';

import React, { PropTypes, Component } from 'react';
import { RaisedButton, TextField } from 'material-ui';
import styles from './ForgotForm.css';
import validator from 'validator';
import Authenticate from '../../utils/authenticate';
const serverErrorMsg = 'Invalid email. Please try again';
const emailErrorMsg = 'Place enter a valid email address.';

class ForgotForm extends Component {
  constructor(props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this._onChangeEmail = this._onChangeEmail.bind(this);
    this._dismissForm = this._dismissForm.bind(this);

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      isEmailValid: false,
      isLoading: false,
      didSend: false
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
      email: email,
      isEmailValid: isEmailValid,
      errorMessage: errorMessage
    });
  }

  _onSubmit() {
    let email = this.state.email.trim();
    if (!validator.isEmail(email)) {
      this.setState({
        errorMessage: emailErrorMsg
      });
    } else if(!this.state.isLoading) {
      this.setState({isLoading: true});
      Authenticate.forgot(email)
        .then(() => {
          this.setState({
            didSend: true
          });
        })
        .catch((err) => {
          this.setState({
            errorMessage: serverErrorMsg,
            isLoading: false
          });
        });
    }
  }

  _dismissForm() {
    this.props.onForgot();
  }

  render() {
    if (!this.state.didSend) {
      return (
        <div className="ForgotForm">
          <div className="ForgotForm-container">
            <TextField floatingLabelText='Email' type='text' onChange={this._onChangeEmail} value={this.state.email} fullWidth={true} /> <br/>
            <RaisedButton primary={true} label="Send Email" disabled={!this.state.isEmailValid || this.state.isLoading} fullWidth={true} onMouseUp={this._onSubmit} onTouchEnd={this._onSubmit} />
            <div className="error-text-container">
              <div className="error-text">{this.state.errorMessage}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="success-message">Reset instructions sent to: {this.state.email}</div>
          <RaisedButton primary={true} label="Okay" fullWidth={true} onMouseUp={this._dismissForm} onTouchEnd={this._dismissForm} />
        </div>
      );
    }
  }

}

ForgotForm.propTypes = {onForgot: PropTypes.func};
ForgotForm.defaultProps = {onForgot: function() {}};

export default ForgotForm;
