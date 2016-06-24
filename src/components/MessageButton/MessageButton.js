'use strict';

import React, { PropTypes, Component } from 'react';
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
  }

  render() {

    return (
      <IconButton onMouseUp={this.props.onClick} onTouchEnd={this.props.onClick} style={{width: '24px', padding: '5px', marginRight: '10px', float: 'right'}}><FontIcon className="material-icons" color={Styles.Colors.grey600}>chat_bubble</FontIcon></IconButton>
    );
  }
}

export default MessageButton;
