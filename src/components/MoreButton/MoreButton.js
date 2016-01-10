'use strict';

import React, { PropTypes, Component } from 'react';
import { IconButton, FontIcon, Styles } from 'material-ui';
import styles from './MoreButton.css';

class MoreButton extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
      didClick: false
    }
  }

  _onClick() {
    this.setState({
      didClick: true
    });
    this.props.onClick();
  }

  render() {
    if (this.state.didClick) {
      return (<div></div>);
    }

    return (
      <IconButton onMouseUp={this._onClick} onTouchEnd={this._onClick}>
        <FontIcon className="material-icons" color={Styles.Colors.grey600}>more_horiz</FontIcon>
      </IconButton>
    );
  }
}

MoreButton.propTypes = {onClick: PropTypes.func};
MoreButton.defaultProps = {onClick: function() {}};

module.exports = MoreButton;
