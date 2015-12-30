'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CoverImageForm.css';
import {track, Events} from '../../utils/SMTIAnalytics';

import IntroduceCoverImageMutation from '../../mutations/IntroduceCoverImageMutation';

class CoverImageForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
  }

  _onCreate(e) {
    if (e.target.files.length > 0) {
      let uri = e.target.files[0];
      Relay.Store.update(
        new IntroduceCoverImageMutation({uri, target: this.props.target})
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

CoverImageForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func, isOpen: PropTypes.bool};
CoverImageForm.defaultProps = {onCancel: function() {}, onCreate: function() {}, isOpen: false};

var CoverImageFormContainer = Relay.createContainer(CoverImageForm, {
  fragments: {
    target: () => Relay.QL`
      fragment on Node {
        ${IntroduceCoverImageMutation.getFragment('target')}
      }
    `,
  },
});

export default CoverImageFormContainer;
