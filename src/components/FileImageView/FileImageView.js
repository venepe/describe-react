'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import FileImage from '../FileImage';
import styles from './FileImageView.css';

class FileImageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FileImage file={this.props.file} height={500} width={null} onDelete={this._onDelete} />
    );
  }
}

export default Relay.createContainer(FileImageView, {
  fragments: {
    file: () => Relay.QL`
      fragment on File {
        ${FileImage.getFragment('file')},
      }
    `
  },
});
