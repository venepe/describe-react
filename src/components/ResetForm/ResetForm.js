'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './ResetForm.css';
import { RaisedButton, TextField, FlatButton } from 'material-ui';
import validator from 'validator';
import Utilities from '../../utils/utilities';
import Authenticate from '../../utils/authenticate';

const errorMessage = 'Invalid password. Please try again';

class ResetForm extends Component {
  constructor(props) {
    super(props);
    this._onChangePassword = this._onChangePassword.bind(this);
    this._onReset = this._onReset.bind(this);

    this.state = {
      email: props.location.query.email,
      token: props.location.query.token,
      password: '',
      errorMessage: '',
      isPasswordValid: false,
      isLoading: false
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
    let password = this.state.password;
    if (this.state.isPasswordValid && !this.state.isLoading) {
      this.setState({isLoading: true});
      Authenticate.login(password)
        .then((meId) => {
          this.props.onReset(meId);
        })
        .catch((err) => {
          this.setState({
            errorMessage: errorMessage,
            isLoading: false
          });
        })
    }
  }

  render() {
    let isDisabled = true;
    if (this.state.isPasswordValid && !this.state.isLoading) {
      isDisabled = false;
    }

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
  }

}

ResetForm.propTypes = {onReset: PropTypes.func};
ResetForm.defaultProps = {onReset: function() {}};

export default ResetForm;
