'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './EditPaperModal.css';
import ModalTypes, { UPDATE_PAPER, DELETE_PAPER } from '../../constants/ModalTypes';

class EditPaperModal extends Component {
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
    let iconButtonElement = (<IconButton><FontIcon className="material-icons">more_horiz</FontIcon></IconButton>);
    return (
        <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-right'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="Update Paper" value={UPDATE_PAPER} />
          <MenuItem primaryText="Delete Paper" value={DELETE_PAPER} />
          <MenuDivider />
          <MenuItem primaryText="Close" />
        </IconMenu>
    );
  }
}

EditPaperModal.propTypes = {id: PropTypes.string, text: PropTypes.string, onItemTouchTap: PropTypes.func};
EditPaperModal.defaultProps = {id: '', text: '', onItemTouchTap: function() {}};

module.exports = EditPaperModal;
