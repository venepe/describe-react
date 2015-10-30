'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, Dialog } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
import styles from './TouchableImage.css';

class TouchableImage extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
      src: props.src,
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
      <div>
        <img className="touchable-image" src={this.state.src} height={200} width={200} onClick={this._onClick} />
      </div>
    );
  }
}

TouchableImage.propTypes = {id: PropTypes.string, src: PropTypes.string, onClick: PropTypes.func};
TouchableImage.defaultProps = {id: '', src: '', onClick: function() {}};

module.exports = TouchableImage;
