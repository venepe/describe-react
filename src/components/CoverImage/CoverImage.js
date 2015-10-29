'use strict';

import React, { PropTypes, Component } from 'react';
import { CardMedia } from 'material-ui';
import styles from './CoverImage.css';

class CoverImage extends Component {
  constructor(props) {
    super(props);
    this._pushImage = this._pushImage.bind(this);
    this._onLongPress = this._onLongPress.bind(this);
    this._renderView = this._renderView.bind(this);
    this.state = {
      title: props.title
    }
  }

  _pushImage() {
  }

  _onLongPress() {
  }

  _renderView(uri) {
    return (
      <CardMedia expandable={true}>
        <img className='CoverImage-img' height={400} src={uri} />
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

CoverImage.propTypes = {onLongPress: PropTypes.func, title: PropTypes.string};
CoverImage.defaultProps = {onLongPress: function() {}, title: 'Image'};

export default CoverImage;
