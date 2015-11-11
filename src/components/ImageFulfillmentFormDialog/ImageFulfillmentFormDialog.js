'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ImageFulfillmentFormDialog.css';
import ImageFulfillmentForm from '../ImageFulfillmentForm';

import TestCaseRoute from '../../routes/TestCaseRoute';

class ImageFulfillmentFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this.state = {
      testCaseId: props.testCaseId,
      component: null
    };
  }

  _onCreate() {
    this.state.component = null
  }

  _onCancel() {
    this.state.component = null
  }

  render() {
    return (
      <div>
        {this.state.component}
      </div>
    );
  }

  show(testCaseId) {
    let testCaseRoute = new TestCaseRoute({testCaseId});
    let component = (<Relay.RootContainer Component={ImageFulfillmentForm} route={testCaseRoute} renderFetched={data => <ImageFulfillmentForm {...data} isOpen={true} onCancel={this._onCancel} onCreate={this._onCreate} /> } />);
    this.setState({
      component
    });
  }
}

ImageFulfillmentFormDialog.propTypes = {testCaseId: PropTypes.string};
ImageFulfillmentFormDialog.defaultProps = {testCaseId: ''};

export default ImageFulfillmentFormDialog;
