'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './ModalableArchyLabel.css';
import TouchableArchyLabel from '../TouchableArchyLabel';

class ModalableArchyLabel extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
      text: props.text,
      id: props.id,
      iconMenu: props.iconMenu
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

    let IconMenu = this.state.iconMenu;

    if (IconMenu) {
      IconMenu = React.cloneElement(IconMenu);
    }

    return (
      <div className="modalable-archy-label">
        <TouchableArchyLabel text={this.state.text} onClick={this._onClick} />
        <div className="modal">
          {IconMenu}
        </div>
      </div>
    );
  }
}

ModalableArchyLabel.propTypes = {id: PropTypes.string, text: PropTypes.string, onClick: PropTypes.func};
ModalableArchyLabel.defaultProps = {id: '', text: '', onClick: function() {}};

module.exports = ModalableArchyLabel;
