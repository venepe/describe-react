'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import FulfillmentImage from '../FulfillmentImage';
import styles from './FulfillmentImageView.css';

class FulfillmentImageView extends Component {
  constructor(props) {
    super(props);
    this._onDelete = this._onDelete.bind(this);
  }

  _onDelete() {
    let path = this.props.location.pathname.replace(/\/fulfillments.*/, '');
    this.props.history.replaceState(null, path);
  }

  render() {
    return (
      <FulfillmentImage fulfillment={this.props.fulfillment} testCase={this.props.testCase} height={500} width={null} onDelete={this._onDelete} />
    );
  }
}

export default Relay.createContainer(FulfillmentImageView, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on File {
        ${FulfillmentImage.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${FulfillmentImage.getFragment('testCase')},
      }
    `,
  },
});
