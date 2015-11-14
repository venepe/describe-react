'use strict';

import React, { PropTypes, Component } from 'react';
import { FontIcon } from 'material-ui';
import styles from './TestCaseLabel.css';
import ArchyLabel from '../ArchyLabel';

class TestCaseLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFulfilled: props.isFulfilled
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  render() {

    let name = 'remove_circle_outline';
    let color = '#E0E0E0';

    if (this.state.isFulfilled) {
      name = 'check_circle';
      color = '#76FF03';
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

TestCaseLabel.propTypes = {id: PropTypes.string, text: PropTypes.string, onClick: PropTypes.func};
TestCaseLabel.defaultProps = {id: '', text: '', onClick: function() {}};

module.exports = TestCaseLabel;
