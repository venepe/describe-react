'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import CoverImage from '../CoverImage';
import styles from './CoverImageView.css';

class CoverImageView extends Component {
  constructor(props) {
    super(props);
    this._goBack = this._goBack.bind(this);
  }

  _goBack() {
    let pathname = this.props.location.pathname;
    if (pathname.indexOf('/me/') !== -1) {
      this.props.history.replaceState(null, '/me');
    } else {
      let path = pathname.replace(/\/coverImages.*/, '');
      this.props.history.replaceState(null, path);
    }

  }

  render() {
    return (
      <CoverImage coverImage={this.props.coverImage} target={this.props.target} height={500} width={null} onDelete={this._goBack} onCreate={this._goBack} />
    );
  }
}

export default Relay.createContainer(CoverImageView, {
  fragments: {
    coverImage: () => Relay.QL`
      fragment on File {
        ${CoverImage.getFragment('coverImage')},
      }
    `,
    target: () => Relay.QL`
      fragment on Node {
        ${CoverImage.getFragment('target')},
      }
    `,
  },
});
