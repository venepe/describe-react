'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import styles from './ModalableImage.css';
import TouchableImage from '../TouchableImage';

class ModalableImage extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._buildMenuItem = this._buildMenuItem.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      src: props.src,
      height: props.height,
      width: props.width,
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

    let iconButtonElement = (<IconButton style={{width: '24px', padding: '0px'}}><FontIcon className="material-icons" color={Styles.Colors.grey600}>mode_edit</FontIcon></IconButton>);

    return (
      <div className="modalable-image">
        <div className="modalable-container">
          <TouchableImage src={this.state.src} height={this.state.height} width={this.state.width} onClick={this._onClick} />
          <div className="modal">
          <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-right'} onItemTouchTap={this._onItemTouchTap}>
            {this._buildMenuItem()}
            <Divider />
            <MenuItem primaryText="Close" />
          </IconMenu>
        </div>
        </div>
      </div>
    );
  }
}

ModalableImage.propTypes = {height: PropTypes.number, width: PropTypes.number, onClick: PropTypes.func, onItemTouchTap: PropTypes.func};
ModalableImage.defaultProps = {src: '', height: 200, width: 200, onClick: function() {}, onItemTouchTap: function() {}};

module.exports = ModalableImage;
