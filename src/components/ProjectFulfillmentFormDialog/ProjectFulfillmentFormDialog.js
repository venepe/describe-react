'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './ProjectFulfillmentFormDialog.css';
import ProjectFulfillmentForm from '../ProjectFulfillmentForm';

import TestCaseRoute from '../../routes/TestCaseRoute';

class ProjectFulfillmentFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);

    this.state = {
      meId: props.meId,
      testCaseId: props.testCaseId
    };
  }

  _onCreate() {
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
        title="Fulfill Test Case"
        modal={false}>
        <Relay.RootContainer Component={ProjectFulfillmentForm} route={testCaseRoute} renderFetched={data => <ProjectFulfillmentForm {...data} onCancel={this._onCancel} onCreate={this._onCreate} /> } />
      </Dialog>
    );
  }

  show(testCaseId, meId) {
    this.setState({
      testCaseId,
      meId
    });
    this.refs.dialog.show();
  }
}

ProjectFulfillmentFormDialog.propTypes = {meId: PropTypes.string, testCaseId: PropTypes.string};
ProjectFulfillmentFormDialog.defaultProps = {meId: '', testCaseId: ''};

export default ProjectFulfillmentFormDialog;
