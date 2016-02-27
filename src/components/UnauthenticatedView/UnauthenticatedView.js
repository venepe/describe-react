'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './UnauthenticatedView.css';
import { Paper } from 'material-ui';

class UnauthenticatedView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="UnauthenticatedView">
        <div>welcome aboard</div>
      </div>
    );
  }
}

export default Unauthenticated;
