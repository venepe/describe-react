'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, Dialog, CardMedia } from 'material-ui';
import styles from './TouchableImage.css';

class TouchableImage extends Component {
  static propTypes = {
    id: PropTypes.string,
    height: PropTypes.number,
    onClick: PropTypes.func,
    overlay: PropTypes.element
  }

  static defaultProps = {
    id: '',
    src: '',
    height: 400,
    onClick: function() {},
    overlay: null
  }

  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
      src: props.src,
      id: props.id,
      height: props.height,
      overlay: props.overlay
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick(e) {
    this.props.onClick(e, this.state.id);
  }

  render() {
    return (
      <CardMedia className='touchable-image' expandable={true} overlay={this.state.overlay} onClick={this._onClick}>
        <img height={this.state.height} src={this.state.src}/>
      </CardMedia>
    );
  }
}

export default TouchableImage;
