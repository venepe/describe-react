'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './MessageListPlaceholder.css';
import { SMTIBaseUrl } from '../../constants';

class MessageListPlaceholder extends Component {
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
      <div className="bubble">
        <img src={`${SMTIBaseUrl}/assets/bubble.png`} width={120} height={120} />
        <div className="bubble-line1">No messages.</div>
        <div className="bubble-line2">asdf</div>
      </div>
    );
  }
}

export default MessageListPlaceholder;
