'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './EditImageModal.css';
import ModalTypes, { DELETE_IMAGE } from '../../constants/ModalTypes';

class EditImageModal extends Component {
  constructor(props) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      id: props.id,
      image: props.image
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onItemTouchTap(event, item) {
    this.props.onItemTouchTap(item.props.value, this.state.id, this.state.image);
  }

  render() {
    let iconButtonElement = (<IconButton><FontIcon className="material-icons">more_horiz</FontIcon></IconButton>);
    return (
        <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-right'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="Delete Image" value={DELETE_IMAGE} />
          <MenuDivider />
          <MenuItem primaryText="Close" />
        </IconMenu>
    );
  }
}

EditImageModal.propTypes = {id: PropTypes.string, onItemTouchTap: PropTypes.func};
EditImageModal.defaultProps = {id: '', onItemTouchTap: function() {}};

module.exports = EditImageModal;
