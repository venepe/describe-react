'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { CardTitle } from 'material-ui';
import TestCaseImage from '../TestCaseImage';
import styles from './TestCaseView.css';

class TestCaseView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushFulfillmentEvents = this._pushFulfillmentEvents.bind(this);
    this._pushTestCaseEvents = this._pushTestCaseEvents.bind(this);
    this.getFulfillment = this.getFulfillment.bind(this);
  }

  _pushFulfillmentEvents(e) {
    e.stopPropagation();
    let projectId = this.props.project.id;
    let testCase = this.props.testCase;
    let testCaseId = testCase.id;
    let fulfillment = this.getFulfillment();;
    let fulfillmentId = fulfillment.id;
    this.router.push(`/projects/${projectId}/testCases/${testCaseId}/fulfillments/${fulfillmentId}/events`);
  }

  _pushTestCaseEvents(e) {
    e.stopPropagation();
    let projectId = this.props.project.id;
    let testCaseId = this.props.testCase.id;
    this.router.push(`/projects/${projectId}/testCases/${testCaseId}/events`);
    return false;
  }

  getFulfillment() {
    let fulfillment = {};
    let testCase = this.props.testCase || {};
    let fulfillments = testCase.fulfillments || {};
    let edges = fulfillments.edges || [];
    if (edges.length > 0) {
      fulfillment = edges[0].node || {};
    }

    return fulfillment;
  }

  render() {
    let uri = '';
    let fulfillmentId = '';
    let testCase = this.props.testCase || {};
    let fulfillment = this.getFulfillment();
    uri = fulfillment.uri;
    fulfillmentId = fulfillment.id;
    return (
      <TestCaseImage project={this.props.project} testCase={testCase} height={400} overlay={<CardTitle title={testCase.text} onClick={this._pushTestCaseEvents} />} onClick={this._pushFulfillmentEvents}/>
    );
  }
}

export default Relay.createContainer(TestCaseView, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        text
        fulfillments(first: 1) {
          edges {
            cursor
            node {
              id
            }
          }
        }
        ${TestCaseImage.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        ${TestCaseImage.getFragment('project')},
      }
    `,
  },
});
