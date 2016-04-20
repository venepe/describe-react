'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import FulfillmentImage from '../FulfillmentImage';
import SMTIToolbar from '../SMTIToolbar';
import styles from './FulfillmentImageView.css';

class FulfillmentImageView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushFulfillmentEvents = this._pushFulfillmentEvents.bind(this);
    this._onDelete = this._onDelete.bind(this);
  }

  _pushFulfillmentEvents() {
    let projectId = this.props.project.id;
    let testCaseId = this.props.testCase.id;
    let fulfillmentId = this.props.fulfillment.id;
    this.router.push(`/projects/${projectId}/testCases/${testCaseId}/fulfillments/${fulfillmentId}/events`);
  }

  _onDelete() {
    let path = this.props.location.pathname.replace(/\/fulfillments.*/, '');
    this.router.replace(path);
  }

  render() {
    return (
      <div>
        <SMTIToolbar title={this.props.testCase.it} />
        <FulfillmentImage fulfillment={this.props.fulfillment} testCase={this.props.testCase} project={this.props.project} height={500} width={null} onClick={this._pushFulfillmentEvents} onDelete={this._onDelete} />
      </div>
    );
  }
}

export default Relay.createContainer(FulfillmentImageView, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on Fulfillment {
        id
        ${FulfillmentImage.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        it
        ${FulfillmentImage.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        ${FulfillmentImage.getFragment('project')},
      }
    `,
  },
});
