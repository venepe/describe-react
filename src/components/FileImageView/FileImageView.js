'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import FileImage from '../FileImage';
import SMTIToolbar from '../SMTIToolbar';
import styles from './FileImageView.css';

class FileImageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SMTIToolbar title={'Image'} />
        <FileImage file={this.props.file} height={500} width={null} onDelete={this._onDelete} />
      </div>
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
