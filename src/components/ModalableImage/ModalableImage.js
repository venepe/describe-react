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
        <TouchableImage src={this.state.src} onClick={this._onClick} />
        <div className="modal">
          {IconMenu}
        </div>
      </div>
    );
  }
}

ModalableImage.propTypes = {id: PropTypes.string, src: PropTypes.string, onClick: PropTypes.func};
ModalableImage.defaultProps = {id: '', src: '', onClick: function() {}};

module.exports = ModalableImage;
