'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ImageFulfillmentForm.css';

import IntroduceFulfillmentMutation from '../../mutations/IntroduceFulfillmentMutation';

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
        new IntroduceFulfillmentMutation({uri, testCase: this.props.testCase})
      );
      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen === true) {
      this._fileUpload.click();
    }
  }

  componentDidMount() {
    this._fileUpload.click();
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

ImageFulfillmentForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func, isOpen: PropTypes.boolean};
ImageFulfillmentForm.defaultProps = {onCancel: function() {}, onCreate: function() {}, isOpen: false};

var ImageFulfillmentFormContainer = Relay.createContainer(ImageFulfillmentForm, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${IntroduceFulfillmentMutation.getFragment('testCase')}
      }
    `,
  },
});

export default ImageFulfillmentFormContainer;