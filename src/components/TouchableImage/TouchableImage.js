'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, Dialog, CardMedia } from 'material-ui';
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
    let width = null;
    if (this.state.width) {
      width = `${this.state.width}px`
    }
    return (
      <div style={{width}}>
        <CardMedia expandable={true}>
          <img className='touchable-image' height={this.state.height} src={this.state.src} onClick={this._onClick}/>
        </CardMedia>
      </div>
    );
  }
}

TouchableImage.propTypes = {id: PropTypes.string, height: PropTypes.number, width: PropTypes.number, onClick: PropTypes.func};
TouchableImage.defaultProps = {id: '', src: '', height: 200, width: 200, onClick: function() {}};

module.exports = TouchableImage;
