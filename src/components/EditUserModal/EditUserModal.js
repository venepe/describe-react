'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, FlatButton, Dialog } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './EditUserModal.css';
import ModalTypes, { VIEW_PROFILE, UPDATE_USER, SIGN_OUT } from '../../constants/ModalTypes';
const SMTIRawTheme = require('../../utils/theme');

class EditUserModal extends Component {
  constructor(props) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      id: props.id
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onItemTouchTap(event, item) {
    this.props.onItemTouchTap(item.props.value, this.state.id);
  }

  render() {
    let iconButtonElement = (<FlatButton label="User" style={{height: 64, backgroundColor: 'transparent', color: SMTIRawTheme.palette.alternateTextColor}} />);
    return (
        <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-left'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="View Profile" value={VIEW_PROFILE} />
          <MenuItem primaryText="Edit Profile" value={UPDATE_USER} />
          <MenuDivider />
          <MenuItem primaryText="Sign Out" value={SIGN_OUT} />
        </IconMenu>
    );
  }
}

EditUserModal.propTypes = {id: PropTypes.string, text: PropTypes.string, onItemTouchTap: PropTypes.func};
EditUserModal.defaultProps = {id: '', text: '', onItemTouchTap: function() {}};

module.exports = EditUserModal;