'use strict';

import React, { PropTypes, Component } from 'react';
import { IconButton, FontIcon, Styles } from 'material-ui';
import styles from './MoreButton.css';

class MoreButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <IconButton onMouseUp={this.props.onClick} onTouchEnd={this.props.onClick}>
        <FontIcon className="material-icons" color={Styles.Colors.grey600}>more_horiz</FontIcon>
      </IconButton>
    );
  }
}

MoreButton.propTypes = {onClick: PropTypes.func};
MoreButton.defaultProps = {onClick: function() {}};

module.exports = MoreButton;
