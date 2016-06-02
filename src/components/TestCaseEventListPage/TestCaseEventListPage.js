'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseEventListPage.css';
import SMTIToolbar from '../SMTIToolbar';
import TestCaseEventListView from '../TestCaseEventListView';

class TestCaseEventListPage extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <div className="TestCaseEventListPage-container">
        <SMTIToolbar title={this.props.testCase.text} />
        <TestCaseEventListView testCase={this.props.testCase} project={this.props.project} />
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseEventListPage, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        text
        ${TestCaseEventListView.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${TestCaseEventListView.getFragment('project')},
      }
    `,
  },
});
