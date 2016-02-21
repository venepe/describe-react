'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import ExampleImage from '../ExampleImage';
import styles from './ExampleImageView.css';

class ExampleImageView extends Component {
  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onDelete = this._onDelete.bind(this);
  }

  _onDelete() {
    let path = this.props.location.pathname.replace(/\/examples.*/, '');
    this.router.replace(path);
  }

  render() {
    return (
      <ExampleImage example={this.props.example} target={this.props.target} height={500} width={null} onDelete={this._onDelete} />
    );
  }
}

ExampleImageView.contextTypes = {
    router: React.PropTypes.object.isRequired
};

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
