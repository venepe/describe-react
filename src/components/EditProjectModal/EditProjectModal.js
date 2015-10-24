'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './EditProjectModal.css';
import EditModalButton from '../EditModalButton';

class EditProjectModal extends Component {
  constructor(props) {
    super(props);
    this._onPress = this._onPress.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      text: props.text,
      id: props.id,
      isModalOpen: false,
      modal: props.modal
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onPress() {
    this.props.onPress(this.state.id);
  }

  _onItemTouchTap(event, item) {
    console.log(item);
  }

  render() {

    return (
        <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_horiz</IconButton>} openDirection={'bottom-right'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="Add Test Case" />
          <MenuItem primaryText="Add Paper" />
          <MenuItem primaryText="Add Image" />
          <MenuItem primaryText="Update Project" />
          <MenuItem primaryText="Delete Project" />
          <MenuDivider />
          <MenuItem primaryText="Close" />
        </IconMenu>
    );
  }
}

EditProjectModal.propTypes = {id: PropTypes.string, text: PropTypes.string, onPress: PropTypes.func};
EditProjectModal.defaultProps = {id: '', text: '', onPress: function() {}};

module.exports = EditProjectModal;
