'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { IconButton, FontIcon, Styles } from 'material-ui';
import styles from './MessageButton.css';

class MessageButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: function() {},
  }
  constructor(props) {
    super(props);
    this.renderNumOfMessagesUnread = this.renderNumOfMessagesUnread.bind(this);
  }

  renderNumOfMessagesUnread() {
    if (this.props.channel.numOfMessagesUnread > 0) {
      return (
        <div className="unread-label">{this.props.channel.numOfMessagesUnread}</div>
      );
    }
  }

  render() {

    return (
      <div>
        <IconButton onMouseUp={this.props.onClick} onTouchEnd={this.props.onClick} style={{width: '24px', padding: '5px', marginRight: '10px', float: 'right'}}>
          <FontIcon className="material-icons" color={Styles.Colors.grey600}>chat_bubble</FontIcon>
        </IconButton>
        {this.renderNumOfMessagesUnread()}
      </div>
    );
  }
}

export default Relay.createContainer(MessageButton, {
  fragments: {
    channel: () => Relay.QL`
      fragment on Channel {
        numOfMessagesUnread
      }
    `
  },
});
