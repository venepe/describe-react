'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, FlatButton, Dialog } from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import styles from './EditUserModal.css';
import ModalTypes, { VIEW_PROFILE, UPDATE_USER, CHANGE_PASSWORD, SIGN_OUT } from '../../constants/ModalTypes';
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
          <MenuItem primaryText="Change Password" value={CHANGE_PASSWORD} />
          <Divider />
          <MenuItem primaryText="Sign Out" value={SIGN_OUT} />
        </IconMenu>
    );
  }
}

EditUserModal.propTypes = {id: PropTypes.string, text: PropTypes.string, onItemTouchTap: PropTypes.func};
EditUserModal.defaultProps = {id: '', text: '', onItemTouchTap: function() {}};

module.exports = EditUserModal;
