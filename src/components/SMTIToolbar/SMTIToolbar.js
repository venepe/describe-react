'use strict';

import React, { PropTypes, Component } from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import styles from './SMTIToolbar.css';

class SMTIToolbar extends Component {
  static propTypes = {
    title: PropTypes.string
  }

  static defaultProps = {
    title: ''
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Toolbar style={{backgroundColor: Colors.grey100}}>
       <ToolbarGroup float="left">
         <ToolbarTitle text={this.props.title} />
       </ToolbarGroup>
     </Toolbar>
    );
  }
}

export default SMTIToolbar;
