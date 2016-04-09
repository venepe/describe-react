'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './DiffLabel.css';
import { diffWords } from 'diff';

class DiffLabel extends Component {
  static propTypes = {
    previous: PropTypes.string,
    current: PropTypes.string
  }

  static defaultProps = {
    previous: '',
    current: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      previous: props.previous,
      current: props.current
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      previous: nextProps.previous,
      current: nextProps.current
    });
  }

  render() {
    let diff = diffWords(this.state.previous, this.state.current);
    let index = 0;
    let text = diff.map(part => {
      index++;
      let added = part.added;
      let removed = part.removed;
      let backgroundColor = added ? '#69F0AE' : removed ? '#FF5252' : '#FFFFFF';
      let value = part.value;
      return (<span key={index} style={{backgroundColor}}>{value}</span>);
    });

    return (
      <div className="diff-label">{text}</div>
    );
  }
}

export default DiffLabel;
