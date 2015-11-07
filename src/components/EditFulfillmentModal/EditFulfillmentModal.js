'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './EditFulfillmentModal.css';
import ModalTypes, { DELETE_FULFILLMENT } from '../../constants/ModalTypes';

class EditFulfillmentModal extends Component {
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
    let iconButtonElement = (<IconButton><FontIcon className="material-icons" color={Styles.Colors.grey700}>more_horiz</FontIcon></IconButton>);
    return (
        <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-left'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="Delete Fulfillment" value={DELETE_FULFILLMENT} />
          <MenuDivider />
          <MenuItem primaryText="Close" />
        </IconMenu>
    );
  }
}

EditFulfillmentModal.propTypes = {id: PropTypes.string, onItemTouchTap: PropTypes.func};
EditFulfillmentModal.defaultProps = {id: '', onItemTouchTap: function() {}};

module.exports = EditFulfillmentModal;
