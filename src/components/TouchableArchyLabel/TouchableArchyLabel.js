'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, Dialog } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
import styles from './TouchableArchyLabel.css';
import ArchyLabel from '../ArchyLabel';

class TouchableArchyLabel extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
      text: props.text,
      id: props.id
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.state.id);
  }

  render() {

    return (
      <div className="touchable-archy-label" onClick={this._onClick} >{this.state.text}
      </div>
    );
  }
}

TouchableArchyLabel.propTypes = {id: PropTypes.string, text: PropTypes.string, onClick: PropTypes.func};
TouchableArchyLabel.defaultProps = {id: '', text: '', onClick: function() {}};

module.exports = TouchableArchyLabel;
