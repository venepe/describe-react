'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './ArchyLabel.css';

class ArchyLabel extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  static defaultProps = {
    text: ''
  }

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

export default ArchyLabel;
