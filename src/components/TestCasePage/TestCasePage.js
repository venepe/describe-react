'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCasePage.css';
import TestCaseView from '../TestCaseView';

class TestCasePage extends Component {
  constructor(props) {
    super(props);
    this._onDelete = this._onDelete.bind(this);
  }

  _onDelete() {
    let projectId = this.props.project.id;
    this.props.history.replaceState(null, `/projects/${projectId}`);
  }

  render() {
    return (
      <div className="TestCasePage-container">
        <TestCaseView testCase={this.props.testCase} project={this.props.project} history={this.props.history} onDelete={this._onDelete} />
      </div>
    );
  }
}

export default Relay.createContainer(TestCasePage, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${TestCaseView.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        ${TestCaseView.getFragment('project')},
      }
    `,
  },
});
