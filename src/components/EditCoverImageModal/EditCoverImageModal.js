'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './EditCoverImageModal.css';
import ModalTypes, { DELETE_COVER_IMAGE, INTRODUCE_COVER_IMAGE } from '../../constants/ModalTypes';

class EditCoverImageModal extends Component {
  constructor(props) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onItemTouchTap(event, item) {
    this.props.onItemTouchTap(item.props.value);
  }

  render() {
    let iconButtonElement = (<IconButton><FontIcon className="material-icons" color={Styles.Colors.grey700}>more_horiz</FontIcon></IconButton>);
    return (
      <div className="EditCoverImageModal-container">
        <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-left'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="Change Cover Image" value={INTRODUCE_COVER_IMAGE} />
          <MenuItem primaryText="Delete Cover Image" value={DELETE_COVER_IMAGE} />
          <MenuDivider />
          <MenuItem primaryText="Close" />
        </IconMenu>
      </div>
    );
  }
}

EditCoverImageModal.propTypes = {onItemTouchTap: PropTypes.func};
EditCoverImageModal.defaultProps = {onItemTouchTap: function() {}};

module.exports = EditCoverImageModal;
