'use strict';

import React, { Component } from 'react';
import styles from './SpinnerView.css';

class SpinnerView extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="loading-spinner"></div>
    );
  }
}

export default SpinnerView;
