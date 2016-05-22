'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './InviteeListPlaceholder.css';
import { SMTIBaseUrl } from '../../constants';

class InviteeListPlaceholder extends Component {
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
      <div className="plane">
        <img src={`${SMTIBaseUrl}/assets/plane.png`} width={120} height={120} />
        <div className="plane-line1">No invitations outstanding!</div>
        <div className="plane-line2">Add someone to the list.</div>
      </div>
    );
  }
}

export default InviteeListPlaceholder;
