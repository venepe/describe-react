'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './TestCasePlaceholder.css';
import { SMTIBaseUrl } from '../../constants';

class TestCasePlaceholder extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tools">
        <img src={`${SMTIBaseUrl}/assets/tools.png`} width={120} height={120} />
        <div className="tools-line1">You have no test cases!</div>
        <div className="tools-line2">Add one to get started.</div>
      </div>
    );
  }
}

export default TestCasePlaceholder;
