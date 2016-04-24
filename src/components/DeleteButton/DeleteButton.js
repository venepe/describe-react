'use strict';

import React, { PropTypes, Component } from 'react';
import { IconButton, FontIcon, Styles } from 'material-ui';
import styles from './DeleteButton.css';

class DeleteButton extends Component {
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
      <IconButton onMouseUp={this.props.onClick} onTouchEnd={this.props.onClick} style={{width: '24px', padding: '0px', float: 'right'}}><FontIcon className="material-icons" color={Styles.Colors.grey600}>delete</FontIcon></IconButton>
    );
  }
}

export default DeleteButton;
