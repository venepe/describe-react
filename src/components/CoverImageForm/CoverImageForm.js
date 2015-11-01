'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CoverImageForm.css';

import IntroduceCoverImageMutation from '../../mutations/IntroduceCoverImageMutation';

class CoverImageForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._openFileDialog = this._openFileDialog.bind(this);
  }

  _onCreate(e) {
    console.log(e);
    if (e.target.files.length > 0) {
      let uri = e.target.files[0];
      Relay.Store.update(
        new IntroduceCoverImageMutation({uri, target: this.props.target})
      );
      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _openFileDialog() {
    let fileUploadDom = React.findDOMNode(this.refs.fileUpload);
    fileUploadDom.click();
  }

  componentDidMount() {
    this._openFileDialog();
  }

  render() {
    return (
        <input
        ref="fileUpload"
        type="file"
        style={{"display" : "none"}}
        onChange={this._onCreate}/>
    );
  }
}

CoverImageForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func};
CoverImageForm.defaultProps = {onCancel: function() {}, onCreate: function() {}};

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
