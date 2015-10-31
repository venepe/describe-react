'use strict';

import React, { Component } from 'react';
import { isFunction } from 'lodash';
import styles from './App.css';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import lightTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
const SMTIRawTheme = require('../../utils/theme');

import Header from '../Header';
import Panel from '../Panel';
import Archy from '../Archy';

class App extends Component {

    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {muiTheme: ThemeManager.getMuiTheme(SMTIRawTheme)};
    }

    render() {
      const {children} = this.props;

        return (
            <div>
              <Header history={this.props.history}/>
              <Panel>
                 {children}
              </Panel>
            </div>
            );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;
