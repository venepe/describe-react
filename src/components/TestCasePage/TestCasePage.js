'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCasePage.css';
import TestCaseView from '../TestCaseView';

class TestCasePage extends Component {
  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onDelete = this._onDelete.bind(this);
  }

  _onDelete() {
    let projectId = this.props.project.id;
    this.router.replace(`/projects/${projectId}`);
  }

  render() {
    return (
      <div className="TestCasePage-container">
        <TestCaseView testCase={this.props.testCase} project={this.props.project} onDelete={this._onDelete} />
      </div>
    );
  }
}

TestCasePage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

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
