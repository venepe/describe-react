'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
import styles from './ModalableArchyLabel.css';
import ArchyLabel from '../ArchyLabel';

class ModalableArchyLabel extends Component {
  constructor(props) {
    super(props);
    this._onPress = this._onPress.bind(this);
    this.state = {
      text: props.text,
      id: props.id,
      iconMenu: props.iconMenu
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

  render() {

    let IconMenu = this.state.iconMenu;

    return (
      <div className="modalable-archy-label">{this.state.text}
      {IconMenu}
      </div>
    );
  }
}

ModalableArchyLabel.propTypes = {id: PropTypes.string, text: PropTypes.string, onPress: PropTypes.func};
ModalableArchyLabel.defaultProps = {id: '', text: '', onPress: function() {}};

module.exports = ModalableArchyLabel;
