'use strict';

import React, { Component } from 'react';
import { IconButton } from 'material-ui';
import styles from './EditModalButton.css';

class EditModalButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <IconButton onBlur={this.props.onBlur} onFocus={this.props.onFocus} iconClassName="material-icons">more_horiz</IconButton>
    );
  }
}

export default EditModalButton;
