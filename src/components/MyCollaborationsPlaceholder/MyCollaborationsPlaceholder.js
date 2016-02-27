'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './MyCollaborationsPlaceholder.css';
import { SMTIBaseUrl } from '../../constants';

class MyCollaborationsPlaceholder extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  static defaultProps = {
    text: ''
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="handshake">
        <img src={`${SMTIBaseUrl}/assets/handshake.png`} width={120} height={120} />
        <div className="handshake-line1">Not collaborating?</div>
        <div className="handshake-line2">Help others get done sooner.</div>
      </div>
    );
  }
}

export default MyCollaborationsPlaceholder;
