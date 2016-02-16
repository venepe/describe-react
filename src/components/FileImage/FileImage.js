'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FileImage.css';
import TouchableImage from '../TouchableImage';

class FileImage extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
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
    this.props.onClick(this.props.file.id);
  }

  render() {
    let uri = '';
    if (this.props.file) {
      uri = this.props.file.uri;
    }
    return (
      <div className="FileImage-container">
        <TouchableImage src={uri} height={this.state.height} width={this.state.width} onClick={this._onClick} />
      </div>
    );
  }
}

FileImage.propTypes = {height: PropTypes.number, width: PropTypes.number, onClick: PropTypes.func};
FileImage.defaultProps = {height: 200, width: 200, onClick: function() {}};

var FileImageContainer = Relay.createContainer(FileImage, {
  fragments: {
    file: () => Relay.QL`
      fragment on File {
        id
        uri
      }
    `,
  },
});

module.exports = FileImageContainer;
