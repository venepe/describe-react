'use strict';

import React, { PropTypes, Component } from 'react';
import { Dialog } from 'material-ui';
import styles from './RegisterFormDialog.css';
import RegisterForm from '../RegisterForm';

class RegisterFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onRegister = this._onRegister.bind(this);
  }

  _onRegister(meId) {
    this.props.onRegister(meId);
  }

  render() {

    return (
      <Dialog ref="dialog"
        title="Sign Up"
        modal={false}>
        <RegisterForm onRegister={this._onRegister} />
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

RegisterFormDialog.propTypes = {onRegister: PropTypes.func};
RegisterFormDialog.defaultProps = {onRegister: function() {}};

export default RegisterFormDialog;
