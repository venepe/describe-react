'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './TestCaseUpdateFormDialog.css';
import TestCaseUpdateForm from '../TestCaseUpdateForm';

import TestCaseRoute from '../../routes/TestCaseRoute';

class TestCaseUpdateFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this.state = {
      testCaseId: props.testCaseId
    };
  }

  _onUpdate() {
    this.refs.dialog.dismiss();
  }

  _onCancel() {
    this.refs.dialog.dismiss();
  }

  render() {
    var testCaseId = this.state.testCaseId;
    var testCaseRoute = new TestCaseRoute({testCaseId});

    return (
      <Dialog ref="dialog"
        title="Update Test Case"
        modal={false}>
        <Relay.RootContainer Component={TestCaseUpdateForm} route={testCaseRoute} renderFetched={data => <TestCaseUpdateForm {...data} onCancel={this._onCancel} onUpdate={this._onUpdate} /> } />
      </Dialog>
    );
  }

  show(testCaseId) {
    this.setState({
      testCaseId
    });
    this.refs.dialog.show();
  }
}

TestCaseUpdateFormDialog.propTypes = {testCaseId: PropTypes.string};
TestCaseUpdateFormDialog.defaultProps = {testCaseId: ''};

export default TestCaseUpdateFormDialog;
