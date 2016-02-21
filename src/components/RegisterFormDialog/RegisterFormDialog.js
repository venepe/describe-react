'use strict';

import React, { PropTypes, Component } from 'react';
import { Dialog } from 'material-ui';
import styles from './RegisterFormDialog.css';
import RegisterForm from '../RegisterForm';

class RegisterFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onRegister = this._onRegister.bind(this);
    this._getInitialState = this._getInitialState.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.show = this.show.bind(this);

    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      isOpened: false
    };
  }

  _onRegister(meId) {
    this.props.onRegister(meId);
  }

  render() {

    return (
      <Dialog ref="dialog"
        title="Sign Up"
        open={this.state.isOpened}
        onRequestClose={this.dismiss}
        modal={false}>
        <RegisterForm onRegister={this._onRegister} />
      </Dialog>
    );
  }

  show() {
    this.setState({
      isOpened: true
    });
  }

  dismiss() {
    this.setState(this._getInitialState());
  }
}

RegisterFormDialog.propTypes = {onRegister: PropTypes.func};
RegisterFormDialog.defaultProps = {onRegister: function() {}};

export default RegisterFormDialog;
