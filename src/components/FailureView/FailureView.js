'use strict';

import React, { Component } from 'react';
import styles from './FailureView.css';
import RefreshTokenView from '../RefreshTokenView';

class FailureView extends Component {
  static defaultProps = {
    error: null,
    retry: null
  }

  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
      retry: props.retry
    }
  }

  render() {
    let status = this.state.error.status;
    console.log(status);
    if (status === 403 || status === 401) {
      return <RefreshTokenView didRefreshToken={() => {
          this.state.retry();
        }} />
    } else {
      <div></div>
    }
  }
}

export default FailureView;
