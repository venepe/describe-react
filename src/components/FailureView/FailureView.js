'use strict';

import React, { Component } from 'react';
import styles from './FailureView.css';
import RefreshTokenView from '../RefreshTokenView';

class FailureView extends Component {
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

FailureView.defaultProps = {error: null, retry: null};

export default FailureView;
