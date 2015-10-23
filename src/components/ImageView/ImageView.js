'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import styles from './ImageView.css';

class ImageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var uri = null;
    if (this.props.image) {
      uri = this.props.image.uri;
    }
    return (
      <div className='ImageView-container'>
        <img className='ImageView-img' src={uri} />
      </div>
    );
  }
}

export default Relay.createContainer(ImageView, {
  fragments: {
    image: () => Relay.QL`
      fragment on Image {
        id
        uri
      }
    `,
  },
});
