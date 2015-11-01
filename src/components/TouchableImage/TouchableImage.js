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
      id: props.id,
      height: props.height,
      width: props.width
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
        <img className="touchable-image" src={this.state.src} height={this.state.height} width={this.state.width} onClick={this._onClick} />
      </div>
    );
  }
}

TouchableImage.propTypes = {id: PropTypes.string, src: PropTypes.string, height: PropTypes.number, width: PropTypes.number, onClick: PropTypes.func};
TouchableImage.defaultProps = {id: '', src: '', height: 200, width: 200, onClick: function() {}};

module.exports = TouchableImage;
