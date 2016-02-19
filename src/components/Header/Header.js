'use strict';

import React, { Component } from 'react';
import AppBar from 'material-ui/lib/app-bar';
import { FlatButton } from 'material-ui';
import event from '../../utils/Event';
import _ from 'lodash';
import UI from '../../utils/UI';
import LoginFormDialog from '../LoginFormDialog';
import RegisterFormDialog from '../RegisterFormDialog';
import UserUpdateFormDialog from '../UserUpdateFormDialog';
import PasswordFormDialog from '../PasswordFormDialog';
import UserDeleteDialog from '../UserDeleteDialog';
import EditUserModal from '../EditUserModal';
import Authenticate from '../../utils/authenticate';
import SMTIStorage from '../../utils/storage';
const SMTIRawTheme = require('../../utils/theme');

import ModalTypes, { VIEW_PROFILE, UPDATE_USER, CHANGE_PASSWORD, SIGN_OUT, DELETE_USER } from '../../constants/ModalTypes';

class Header extends Component {

    constructor(props) {
        super(props);
        this._showLogin = this._showLogin.bind(this);
        this._showRegister = this._showRegister.bind(this);
        this._onLogin = this._onLogin.bind(this);
        this._onRegister = this._onRegister.bind(this);
        this._onForgot = this._onForgot.bind(this);
        this._onRegisterLogin = this._onRegisterLogin.bind(this);
        this._pushProjects = this._pushProjects.bind(this);
        this._pushCollaborations = this._pushCollaborations.bind(this);
        this._presentDialog = this._presentDialog.bind(this);
        this._onDeleteUser = this._onDeleteUser.bind(this);


        this.state = {
            zDepth: UI.windowWidth() <= UI.BREAK_POINT ? 0 : 1
        };
        this._onResize = _.debounce(this._onResize, 150).bind(this);
    }

    _onLeftClick(e) {
        event.stop(e);
    }

    _showLogin() {
        this.refs.loginFormDialog.show();
    }

    _onLogin() {
      this.refs.loginFormDialog.dismiss();
      this.props.history.pushState(null, '/myprojects');
    }

    _showRegister() {
      this.refs.registerFormDialog.show();
    }

    _onRegister() {
      this.refs.registerFormDialog.dismiss();
      this.props.history.pushState(null, '/myprojects');
    }

    _onRegisterLogin() {
      this.refs.loginFormDialog.dismiss();
      this.props.history.pushState(null, '/myprojects');
    }

    _onForgot() {
      this.refs.loginFormDialog.dismiss();
    }

    _pushProjects() {
      this.props.history.pushState(null, '/myprojects');
    }

    _pushCollaborations() {
      this.props.history.pushState(null, '/mycollaborations');
    }

    _onDeleteUser() {
      Authenticate.unregister()
        .then(() => {
          this.props.history.replaceState(null, '/');
        })
        .catch(() => {
          this.props.history.replaceState(null, '/');
        })
    }

    _presentDialog(dialogType) {
      switch (dialogType) {
          case VIEW_PROFILE:
            this.props.history.pushState(null, '/me');
            break;
          case UPDATE_USER:
            let meId = SMTIStorage.getMeIdFromLocalStorage();
            this.refs.userUpdateFormDialog.show(meId);
            break;
          case CHANGE_PASSWORD:
            this.refs.passwordFormDialog.show();
            break;
          case DELETE_USER:
          this.refs.userDeleteDialog.show();
            break;
          case SIGN_OUT:
              Authenticate.logoff()
                .then(() => {
                  this.props.history.replaceState(null, '/');
                })
                .catch(() => {
                  this.props.history.replaceState(null, '/');
                })
            break;
        default:

      }
    }

    _onResize(e) {
        this.setState({
            zDepth: UI.windowWidth() <= UI.BREAK_POINT ? 0 : 1
        });
    }

    componentWillMount() {
        window.addEventListener('resize', this._onResize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize, false);
    }

    render() {
      let children;
      if (Authenticate.isLoggedIn()) {
        // children = [<FlatButton key={0} style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Projects"} onClick={this._pushProjects} />, <FlatButton key={1} style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Collaborations"} onClick={this._pushCollaborations} />, <EditUserModal key={2} onItemTouchTap={this._presentDialog} />];
        children = [<FlatButton key={0} style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Projects"} onClick={this._pushProjects} />, <EditUserModal key={1} onItemTouchTap={this._presentDialog} />];
      } else {
        children = [<FlatButton key={0} style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Log in"} onClick={this._showLogin} />, <FlatButton key={1}  style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Sign up"} onClick={this._showRegister} />];
      }
        return (
          <div>
            <AppBar title="Describe"
              iconElementLeft={<div />}
              children={children}
              zDepth={ this.state.zDepth } />
            <LoginFormDialog ref="loginFormDialog" onLogin={this._onLogin} onRegister={this._onRegisterLogin} onForgot={this._onForgot} />
            <RegisterFormDialog ref="registerFormDialog" onRegister={this._onRegister} />
            <PasswordFormDialog ref="passwordFormDialog" />
            <UserUpdateFormDialog ref="userUpdateFormDialog" onMenuItemClick={this._presentDialog}/>
            <UserDeleteDialog ref="userDeleteDialog" onDelete={this._onDeleteUser}/>
          </div>
            );
    }
}

export default Header;
