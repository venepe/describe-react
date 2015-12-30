'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import ExampleImage from '../ExampleImage';
import styles from './ExampleImageView.css';

class ExampleImageView extends Component {
  constructor(props) {
    super(props);
    this._onDelete = this._onDelete.bind(this);
  }

  _onDelete() {
    let path = this.props.location.pathname.replace(/\/examples.*/, '');
    this.props.history.replaceState(null, path);
  }

  render() {
    return (
      <ExampleImage example={this.props.example} target={this.props.target} height={500} width={null} onDelete={this._onDelete} />
    );
  }
}

export default Relay.createContainer(ExampleImageView, {
  fragments: {
    example: () => Relay.QL`
      fragment on File {
        ${ExampleImage.getFragment('example')},
      }
    `,
    target: () => Relay.QL`
      fragment on Node {
        ${ExampleImage.getFragment('target')},
      }
    `,
  },
});
