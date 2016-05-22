'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './MyInvitationsPlaceholder.css';
import { SMTIBaseUrl } from '../../constants';

class MyInvitationsPlaceholder extends Component {
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
      <div className="letter">
        <img src={`${SMTIBaseUrl}/assets/letter.png`} width={120} height={120} />
        <div className="letter-line1">You have no invitations!</div>
        <div className="letter-line2">Nobody has invited you to collaborate.</div>
      </div>
    );
  }
}

export default MyInvitationsPlaceholder;
