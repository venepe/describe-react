'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './ModalableArchyLabel.css';
import TouchableArchyLabel from '../TouchableArchyLabel';

class ModalableArchyLabel extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._buildMenuItem = this._buildMenuItem.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      text: props.text,
      sheetOptions: props.sheetOptions
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick();
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
      <div className="modalable-archy-label">
          <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-right'} onItemTouchTap={this._onItemTouchTap}>
            {this._buildMenuItem()}
            <MenuDivider />
            <MenuItem primaryText="Close" />
          </IconMenu>
        <TouchableArchyLabel text={this.state.text} onClick={this._onClick} />
      </div>
    );
  }
}

ModalableArchyLabel.propTypes = {text: PropTypes.string, onClick: PropTypes.func, onItemTouchTap: PropTypes.func};
ModalableArchyLabel.defaultProps = {text: '', onClick: function() {}, onItemTouchTap: function() {}};

module.exports = ModalableArchyLabel;
