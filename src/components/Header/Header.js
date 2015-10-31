'use strict';

import React, { Component } from 'react';
import AppBar from 'material-ui/lib/app-bar';
import { FlatButton } from 'material-ui';
import event from '../../utils/Event';
import _ from 'lodash';
import UI from '../../utils/UI';
const SMTIRawTheme = require('../../utils/theme');

class Header extends Component {

    constructor(props) {
        super(props);
        this._onLogin = this._onLogin.bind(this);
        this._onSignup = this._onSignup.bind(this);

        this.state = {
            zDepth: UI.windowWidth() <= UI.BREAK_POINT ? 0 : 1
        };
        this._onResize = _.debounce(this._onResize, 150).bind(this);
    }

    _onLeftClick(e) {
        event.stop(e);
    }

    _onLogin() {
        this.props.history.pushState(null, '/login');
    }

    _onSignup() {

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
        let children = [<FlatButton style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Log in"} onClick={this._onLogin} />, <FlatButton  style={{backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} label={"Sign up"} onClick={this._onSignup} />];
        return (
            <AppBar title="Sumseti"
              iconClassNameLeft="icon-html5"
              children={children}
              onLeftIconButtonTouchTap={ this._onLeftClick.bind(this) }
              zDepth={ this.state.zDepth } />
            );
    }
}

export default Header;
