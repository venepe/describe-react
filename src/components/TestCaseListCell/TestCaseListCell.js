'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { CardTitle } from 'material-ui';
import styles from './TestCaseListCell.css';
import TestCaseImage from '../TestCaseImage';

class TestCaseListCell extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    key: PropTypes.number,
    onClick: PropTypes.func
  }

  static defaultProps = {
    key: 0,
    onClick: function() {}
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onClick = this._onClick.bind(this);
    this.getFulfillment = this.getFulfillment.bind(this);
  }

  _onClick(fulfillmentId) {
    let testCaseId = this.props.testCase.id;
    this.props.onClick({testCaseId, fulfillmentId});
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
    fulfillmentId = fulfillment.id;
    return (
      <div className="TestCaseListCell-container">
        <TestCaseImage project={this.props.project} testCase={testCase} height={400} overlay={<CardTitle title={testCase.text} />} onClick={() => {this._onClick(fulfillmentId)}}/>
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseListCell, {
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
