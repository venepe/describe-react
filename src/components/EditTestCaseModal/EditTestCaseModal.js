'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, FontIcon, Dialog, Styles } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './EditTestCaseModal.css';
import ModalTypes, { INTRODUCE_IMAGE, FULFILL_IMAGE, UPDATE_TEST_CASE, DELETE_TEST_CASE } from '../../constants/ModalTypes';

class EditTestCaseModal extends Component {
  constructor(props) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      id: props.id,
      testCase: props.testCase
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onItemTouchTap(event, item) {
    this.props.onItemTouchTap(item.props.value, this.state.id, this.state.testCase);
  }

  render() {
    let iconButtonElement = (<IconButton><FontIcon className="material-icons" color={Styles.Colors.grey600}>more_horiz</FontIcon></IconButton>);
    return (
        <IconMenu iconButtonElement={iconButtonElement} openDirection={'bottom-left'} onItemTouchTap={this._onItemTouchTap}>
          <MenuItem primaryText="Add Image" value={INTRODUCE_IMAGE} />
          <MenuItem primaryText="Fulfill Test Case" value={FULFILL_IMAGE} />
          <MenuItem primaryText="Update Test Case" value={UPDATE_TEST_CASE} />
          <MenuItem primaryText="Delete Test Case" value={DELETE_TEST_CASE} />
          <MenuDivider />
          <MenuItem primaryText="Close" />
        </IconMenu>
    );
  }
}

EditTestCaseModal.propTypes = {id: PropTypes.string, text: PropTypes.string, onItemTouchTap: PropTypes.func};
EditTestCaseModal.defaultProps = {id: '', text: '', onItemTouchTap: function() {}};

module.exports = EditTestCaseModal;
