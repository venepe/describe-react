'use strict';

import React from 'react';
import { isFunction } from 'lodash';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import lightTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';

import Header from '../Header';
import Panel from '../Panel';
import Archy from '../Archy';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {muiTheme: ThemeManager.getMuiTheme(lightTheme)};
    }

    render() {
      let object = {
        component: (<div>describe:</div>),
        nodes: [
          {
            component: (<div>hellow world</div>),
            nodes: []
          }
        ]
      };

        return (
            <div>
              <Header/>
              <Panel>
                <Archy archible={object}/>
              </Panel>
            </div>
            );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;
