'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './ContactListPlaceholder.css';
import { SMTIBaseUrl } from '../../constants';

class ContactListPlaceholder extends Component {
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
      <div className="group">
        <img src={`${SMTIBaseUrl}/assets/group.png`} width={120} height={120} />
        <div className="group-line1">You have no collaborators!</div>
        <div className="group-line2">Invite someone and work together.</div>
      </div>
    );
  }
}

export default ContactListPlaceholder;
