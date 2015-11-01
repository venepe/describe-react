'use strict';

import React, { PropTypes, Component } from 'react';
import { CardMedia } from 'material-ui';
import styles from './CoverImage.css';
import EditCoverImageModal from '../EditCoverImageModal';
import ModalableImage from '../ModalableImage';

class CoverImage extends Component {
  constructor(props) {
    super(props);
    this._pushImage = this._pushImage.bind(this);
    this._renderView = this._renderView.bind(this);
    this.state = {
      title: props.title,
      isEditable: props.isEditable
    }
  }

  _pushImage() {
  }

  _renderView(uri) {
    let editModal = (<div></div>);
    if (this.state.isEditable) {
      editModal = (<div className="modal"><EditCoverImageModal className="modal" onItemTouchTap={this.props.onMenuItemClick} /></div>);
    }
    return (
      <CardMedia className='CoverImage-container' expandable={true}>
        <img className='CoverImage-img' height={400} src={uri} />
        {editModal}
      </CardMedia>
    );
  }

  render() {
    var uri;
    var id;
    var view;
    if (this.props.coverImage) {
      uri = this.props.coverImage.uri;
    }
    view = this._renderView(uri);
    return (
      <div className='CoverImage-container'>
        {view}
      </div>
    );
  }
}

CoverImage.propTypes = {onMenuItemClick: PropTypes.func, title: PropTypes.string};
CoverImage.defaultProps = {onMenuItemClick: function() {}, title: 'Image', isEditable: false};

export default CoverImage;
