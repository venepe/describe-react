'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ImageFulfillmentForm.css';

import FulfillImageMutation from '../../mutations/FulfillImageMutation';

class ImageFulfillmentForm extends Component {
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
        new FulfillImageMutation({uri, testCase: this.props.testCase})
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

ImageFulfillmentForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func};
ImageFulfillmentForm.defaultProps = {onCancel: function() {}, onCreate: function() {}};

var ImageFulfillmentFormContainer = Relay.createContainer(ImageFulfillmentForm, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${FulfillImageMutation.getFragment('testCase')}
      }
    `,
  },
});

export default ImageFulfillmentFormContainer;
