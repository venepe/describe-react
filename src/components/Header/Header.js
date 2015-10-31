'use strict';

import React, { Component } from 'react';
import AppBar from 'material-ui/lib/app-bar';
import { FlatButton } from 'material-ui';
import event from '../../utils/Event';
import _ from 'lodash';
import UI from '../../utils/UI';
import LoginFormDialog from '../LoginFormDialog';
import RegisterFormDialog from '../RegisterFormDialog';
const SMTIRawTheme = require('../../utils/theme');

class Header extends Component {

    constructor(props) {
        super(props);
        this._showLogin = this._showLogin.bind(this);
        this._showRegister = this._showRegister.bind(this);
        this._onLogin = this._onLogin.bind(this);
        this._onRegister = this._onRegister.bind(this);


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
        let children = [<FlatButton key={0} style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Log in"} onClick={this._showLogin} />, <FlatButton key={1}  style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Sign up"} onClick={this._showRegister} />];
        return (
          <div>
            <AppBar title="Sumseti"
              iconClassNameLeft="icon-html5"
              children={children}
              onLeftIconButtonTouchTap={ this._onLeftClick.bind(this) }
              zDepth={ this.state.zDepth } />
            <LoginFormDialog ref="loginFormDialog" onLogin={this._onLogin} />
            <RegisterFormDialog ref="registerFormDialog" onRegister={this._onRegister} />
          </div>
            );
    }
}

export default Header;
