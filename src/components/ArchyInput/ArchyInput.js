'use strict';

import React, { PropTypes, Component } from 'react';
import { TextField } from 'material-ui';
import styles from './ArchyInput.css';

class ArchyInput extends Component {
  constructor(props) {
    super(props);
    this._onChangeText = this._onChangeText.bind(this);
    this.state = {
      text: props.text,
    }
  }

  _onChangeText(e) {
    let text = e.target.value;
    this.setState({
      text
    });
    this.props.onChangeText(text);
  }

  render() {
    return (
      <div className="archy-label">
        <TextField hintText={this.props.placeholder} type='text' onChange={this._onChangeText} value={this.state.text} fullWidth={true} /> <br/>
      </div>
    );
  }
}

ArchyInput.propTypes = {text: PropTypes.string, id: PropTypes.string, onChangeText: PropTypes.func, placeholder: PropTypes.string};
ArchyInput.defaultProps = {text: '', id: null, onChangeText: function() {}, placeholder: ''};

export default ArchyInput;
