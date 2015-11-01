'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './ModalableImage.css';
import TouchableImage from '../TouchableImage';

class ModalableImage extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
      src: props.src,
      id: props.id,
      height: props.height,
      width: props.width,
      iconMenu: props.iconMenu
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

    let IconMenu = this.state.iconMenu;

    if (IconMenu) {
      IconMenu = React.cloneElement(IconMenu);
    }

    return (
      <div className="modalable-image">
        <TouchableImage src={this.state.src} height={this.state.height} width={this.state.width} onClick={this._onClick} />
        <div className="modal">
          {IconMenu}
        </div>
      </div>
    );
  }
}

ModalableImage.propTypes = {id: PropTypes.string, src: PropTypes.string, height: PropTypes.number, width: PropTypes.number, onClick: PropTypes.func};
ModalableImage.defaultProps = {id: '', src: '', height: 200, width: 200, onClick: function() {}};

module.exports = ModalableImage;
