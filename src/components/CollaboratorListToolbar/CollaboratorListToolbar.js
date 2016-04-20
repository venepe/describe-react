'use strict';

import React, { PropTypes, Component } from 'react';
import { IconButton, FontIcon, Styles, Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import styles from './CollaboratorListToolbar.css';

class CollaboratorListToolbar extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func
  }

  static defaultProps = {
    title: '',
    onClick: function() {}
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Toolbar style={{backgroundColor: Colors.grey100}}>
       <ToolbarGroup float="left">
         <ToolbarTitle text={this.props.title} />
         <ToolbarSeparator />
       </ToolbarGroup>
       <ToolbarGroup float="right">
         <IconButton onMouseUp={this.props.onClick} onTouchEnd={this.props.onClick} style={{width: '24px', padding: '0px'}}><FontIcon className="material-icons" color={Styles.Colors.grey600}>add</FontIcon></IconButton>
       </ToolbarGroup>
     </Toolbar>
    );
  }
}

export default CollaboratorListToolbar;
