'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './ArchyLabel.css';

class ArchyLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      text: nextProps.text
    });
  }

  render() {
    return (
      <div className="archy-label">{this.state.text}</div>
    );
  }
}

ArchyLabel.propTypes = {text: PropTypes.string};
ArchyLabel.defaultProps = {text: ''};

export default ArchyLabel;
