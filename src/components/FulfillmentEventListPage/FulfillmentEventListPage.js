'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentEventListPage.css';
import SMTIToolbar from '../SMTIToolbar';
import FulfillmentEventListView from '../FulfillmentEventListView';

class FulfillmentEventListPage extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <div className="FulfillmentEventListPage-container">
        <SMTIToolbar title={this.props.testCase.text} />
        <FulfillmentEventListView fulfillment={this.props.fulfillment} testCase={this.props.testCase} project={this.props.project} />
      </div>
    );
  }
}

export default Relay.createContainer(FulfillmentEventListPage, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on Fulfillment {
        ${FulfillmentEventListView.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        text
        ${FulfillmentEventListView.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${FulfillmentEventListView.getFragment('project')},
      }
    `,
  },
});
