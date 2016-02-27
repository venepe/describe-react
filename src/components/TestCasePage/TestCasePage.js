'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCasePage.css';
import TestCaseView from '../TestCaseView';

class TestCasePage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onDelete = this._onDelete.bind(this);
  }

  _onDelete() {
    let path = this.props.location.pathname.replace(/\/testCases.*/, '');
    this.router.replace(path);
  }

  render() {
    return (
      <div className="TestCasePage-container">
        <TestCaseView testCase={this.props.testCase} project={this.props.project} onDelete={this._onDelete} />
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
