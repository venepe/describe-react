'use strict';

import React, { PropTypes, Component } from 'react';
import { Dialog } from 'material-ui';
import styles from './LoginFormDialog.css';
import LoginForm from '../LoginForm';

class LoginFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onLogin = this._onLogin.bind(this);
  }

  _onLogin(meId) {
    this.props.onLogin(meId);
  }

  render() {

    return (
      <Dialog ref="dialog"
        title="Log In"
        modal={false}>
        <LoginForm onLogin={this._onLogin} />
      </Dialog>
    );
  }

  show() {
    this.refs.dialog.show();
  }

  dismiss() {
    this.refs.dialog.dismiss();
  }
}

LoginFormDialog.propTypes = {onLogin: PropTypes.func};
LoginFormDialog.defaultProps = {onLogin: function() {}};

export default LoginFormDialog;
