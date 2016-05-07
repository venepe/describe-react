'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FontIcon } from 'material-ui';
import styles from './TestCaseLabel.css';
import ArchyLabel from '../ArchyLabel';

class TestCaseLabel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  render() {

    let name = 'remove_circle_outline';
    let color = '#E0E0E0';

    if (this.props.testCase.isFulfilled) {
      name = 'check_circle';
      color = '#69F0AE';
    }

    return (
      <div className="test-case-label">
        <div className="isFulfilledIcon">
          <FontIcon className="material-icons" color={color}>{name}</FontIcon>
        </div>
        <ArchyLabel text={'it should:'} />
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseLabel, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        isFulfilled
      }
    `,
  },
});
