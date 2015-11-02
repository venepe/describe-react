'use strict';

import React, { PropTypes, Component } from 'react';
import { Dialog } from 'material-ui';
import styles from './LoginFormDialog.css';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import ForgotForm from '../ForgotForm';

class LoginFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onLogin = this._onLogin.bind(this);
    this._onShowRegister = this._onShowRegister.bind(this);
    this._onShowForgot = this._onShowForgot.bind(this);
    this._onRegister = this._onRegister.bind(this);
    this._onForgot = this._onForgot.bind(this);
    this._reset = this._reset.bind(this);

    this.state = this._getInitialState();

  }

  _getInitialState() {
    return {
      component: (<LoginForm onLogin={this._onLogin} onShowRegister={this._onShowRegister} onShowForgot={this._onShowForgot} />),
      dialogTitle: 'Log In'
    };
  }

  _onLogin(meId) {
    this.props.onLogin(meId);
  }

  _onShowRegister() {
    this.setState({
      component: (<RegisterForm onRegister={this._onRegister} />),
      dialogTitle: 'Sign Up'
    });
  }

  _onShowForgot() {
    this.setState({
      component: (<ForgotForm onForgot={this._onForgot} />),
      dialogTitle: 'Forgot'
    });
  }

  _onRegister(meId) {
    this.props.onRegister(meId);
  }

  _onForgot() {
    this.props.onForgot();
  }

  render() {

    return (
      <Dialog ref="dialog"
        title={this.state.dialogTitle}
        onClickAway={this._reset}
        modal={false}>
        {this.state.component}
      </Dialog>
    );
  }

  show() {
    this.refs.dialog.show();
  }

  dismiss() {
    this.refs.dialog.dismiss();
    this.setState(this._getInitialState());
  }

  _reset() {
    this.setState(this._getInitialState());
  }
}

LoginFormDialog.propTypes = {onLogin: PropTypes.func, onRegister: PropTypes.func, onForgot: PropTypes.func};
LoginFormDialog.defaultProps = {onLogin: function() {}, onRegister: function() {}, onForgot: function() {}};

export default LoginFormDialog;
