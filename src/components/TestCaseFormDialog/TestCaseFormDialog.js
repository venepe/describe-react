'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './TestCaseFormDialog.css';
import TestCaseForm from '../TestCaseForm';

import ProjectRoute from '../../routes/ProjectRoute';

class TestCaseFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this.state = {
      projectId: props.projectId
    };
  }

  _onCreate() {
    this.refs.dialog.dismiss();
  }

  _onCancel() {
    this.refs.dialog.dismiss();
  }

  render() {
    var projectId = this.state.projectId;
    var projectRoute = new ProjectRoute({projectId});

    return (
      <Dialog ref="dialog"
        title="Add Test Case"
        modal={false}>
        <Relay.RootContainer Component={TestCaseForm} route={projectRoute} renderFetched={data => <TestCaseForm {...data} onCancel={this._onCancel} onCreate={this._onCreate} /> } />
      </Dialog>
    );
  }

  show(projectId) {
    console.log(projectId);
    this.setState({
      projectId
    });
    this.refs.dialog.show();
  }
}

TestCaseFormDialog.propTypes = {projectId: PropTypes.string};
TestCaseFormDialog.defaultProps = {projectId: ''};

export default TestCaseFormDialog;
