'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import styles from './SettingsButton.css';

class SettingsButton extends Component {
  static propTypes = {
    onItemTouchTap: PropTypes.func
  }

  static defaultProps = {
    onItemTouchTap: function() {}
  }
  constructor(props) {
    super(props);
    this._buildMenuItem = this._buildMenuItem.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      sheetOptions: props.sheetOptions
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _buildMenuItem() {
    if (this.state.sheetOptions) {
      return this.state.sheetOptions.options.map(function (object, index) {
        let menuItem = (
          <MenuItem key={index} primaryText={object.text} value={object.value} />
        );
       return menuItem;
     }.bind(this));
    }
  }

  _onItemTouchTap(event, item) {
    this.props.onItemTouchTap(item.props.value);
  }

  render() {
    let iconButtonElement = (<IconButton style={{width: '24px', padding: '0px'}}><FontIcon className="material-icons" color={Styles.Colors.grey600}>more_vert</FontIcon></IconButton>);
    return (
      <IconMenu className={'icon-menu'} iconButtonElement={iconButtonElement} openDirection={'bottom-left'} onItemTouchTap={this._onItemTouchTap}>
        {this._buildMenuItem()}
        <Divider />
        <MenuItem primaryText="Close" />
      </IconMenu>
    );
  }
}

export default SettingsButton;
