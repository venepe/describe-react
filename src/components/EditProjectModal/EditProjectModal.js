'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './EditProjectModal.css';
import ModalTypes, { INTRODUCE_TEST_CASE, UPDATE_PROJECT, DELETE_PROJECT } from '../../constants/ModalTypes';

class EditProjectModal extends Component {
  constructor(props) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      id: props.id,
      project: props.project
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onItemTouchTap(event, item) {
    this.props.onItemTouchTap(item.props.value, this.state.id, this.state.project);
  }

  render() {
    let iconButtonElement = (<IconButton><FontIcon className="material-icons" color={Styles.Colors.grey600}>more_horiz</FontIcon></IconButton>);
    return (
        <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-right'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="Add Test Case" value={INTRODUCE_TEST_CASE} />
          <MenuItem primaryText="Update Project" value={UPDATE_PROJECT} />
          <MenuItem primaryText="Delete Project" value={DELETE_PROJECT} />
          <MenuDivider />
          <MenuItem primaryText="Close" />
        </IconMenu>
    );
  }
}

EditProjectModal.propTypes = {id: PropTypes.string, text: PropTypes.string, onItemTouchTap: PropTypes.func};
EditProjectModal.defaultProps = {id: '', text: '', onItemTouchTap: function() {}};

module.exports = EditProjectModal;
