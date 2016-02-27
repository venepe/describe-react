'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, Dialog, CardMedia } from 'material-ui';
import styles from './TouchableImage.css';

class TouchableImage extends Component {
  static propTypes = {
    id: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    onClick: PropTypes.func
  }

  static defaultProps = {
    id: '',
    src: '',
    height: 200,
    width: 200,
    onClick: function() {}
  }

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

export default TouchableImage;
