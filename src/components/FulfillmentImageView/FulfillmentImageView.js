'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import FulfillmentImage from '../FulfillmentImage';
import styles from './FulfillmentImageView.css';

class FulfillmentImageView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onDelete = this._onDelete.bind(this);
  }

  _onDelete() {
    let path = this.props.location.pathname.replace(/\/fulfillments.*/, '');
    this.router.replace(path);
  }

  render() {
    return (
      <FulfillmentImage fulfillment={this.props.fulfillment} testCase={this.props.testCase} project={this.props.project} height={500} width={null} onDelete={this._onDelete} />
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
    project: () => Relay.QL`
      fragment on Project {
        ${FulfillmentImage.getFragment('project')},
      }
    `,
  },
});
