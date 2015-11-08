'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import { CardMedia } from 'material-ui';
import styles from './ImageView.css';

class ImageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var uri = null;
    if (this.props.file) {
      uri = this.props.file.uri;
    }
    return (
      <CardMedia expandable={true}>
        <img className='ImageView-img' src={uri} />
      </CardMedia>
    );
  }
}

export default Relay.createContainer(ImageView, {
  fragments: {
    file: () => Relay.QL`
      fragment on File {
        id
        uri
      }
    `,
  },
});
