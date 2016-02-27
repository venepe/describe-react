'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import styles from './EditUserSettingsModal.css';
import ModalTypes, { DELETE_USER } from '../../constants/ModalTypes';

class EditUserSettingsModal extends Component {
  static propTypes = {
    onItemTouchTap: PropTypes.func
  }

  static defaultProps = {
    onItemTouchTap: function() {}
  }

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
        <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-left'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="Delete Account" value={DELETE_USER} />
          <Divider />
          <MenuItem primaryText="Close" />
        </IconMenu>
    );
  }
}

export default EditUserSettingsModal;
