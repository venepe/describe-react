'use strict';

import React, { PropTypes, Component } from 'react';
import { IconMenu, IconButton, Dialog } from 'material-ui';
import styles from './TouchableArchyLabel.css';
import ArchyLabel from '../ArchyLabel';

class TouchableArchyLabel extends Component {
  static propTypes = {
    id: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func
  }

  static defaultProps = {
    id: '',
    text: '',
    onClick: function() {}
  }

  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
      text: props.text,
      id: props.id
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.state.id);
  }

  render() {

    return (
      <div className="touchable-archy-label" onClick={this._onClick} >{this.state.text}
      </div>
    );
  }
}

export default TouchableArchyLabel;
