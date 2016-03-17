'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ExampleForm.css';
import { track, Events } from '../../utils/SMTIAnalytics';

import { IntroduceExampleMutation } from '../../mutations';

class ExampleForm extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    isOpen: PropTypes.bool
  }

  static defaultProps = {
    onCancel: function() {},
    isOpen: false
  }

  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
  }

  _onCreate(e) {
    if (e.target.files.length > 0) {
      let uri = e.target.files[0];
      Relay.Store.commitUpdate(
        new IntroduceExampleMutation({uri, target: this.props.target})
      );
      //Start SMTIAnalytics
      track(Events.ADDED_EXAMPLE);
      //End SMTIAnalytics

    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen === true) {
      this._fileUpload.click();
      this.props.onCancel();
    }
  }

  render() {
    return (
        <input
        ref={(c) => this._fileUpload = c}
        type="file"
        style={{"display" : "none"}}
        onChange={this._onCreate}/>
    );
  }
}

export default Relay.createContainer(ExampleForm, {
  fragments: {
    target: () => Relay.QL`
      fragment on Node {
        ${IntroduceExampleMutation.getFragment('target')}
      }
    `,
  },
});
