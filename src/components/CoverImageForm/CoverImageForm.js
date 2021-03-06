'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CoverImageForm.css';
import { track, Events } from '../../utils/SMTIAnalytics';

import { IntroduceUserCoverMutation } from '../../mutations';

class CoverImageForm extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onCreate: PropTypes.func,
    isOpen: PropTypes.bool
  }

  static defaultProps = {
    onCancel: function() {},
    onCreate: function() {},
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
        new IntroduceUserCoverMutation({uri, user: this.props.user})
      );
      //Start SMTIAnalytics
      track(Events.ADDED_COVER_IMAGE);
      //End SMTIAnalytics

      this.props.onCreate();
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

export default Relay.createContainer(CoverImageForm, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${IntroduceUserCoverMutation.getFragment('user')}
      }
    `,
  },
});
