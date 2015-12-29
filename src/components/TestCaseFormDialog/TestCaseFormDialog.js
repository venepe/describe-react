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
    if (props.isVisible === true) {
      this.refs.dialog.show();
    }

    this.state = {
      isVisible: props.isVisible
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== undefined) {
      if (nextProps.isVisible === true) {
        this.refs.dialog.show();
      } else {
        this.refs.dialog.dismiss();
      }
    }
    this.setState({
      ...nextProps
    });
  }

  render() {

    return (
      <Dialog ref="dialog"
        title="Add Test Case"
        modal={false}>
        <TestCaseForm project={this.props.project} onCancel={this.props.onCancel} onCreate={this.props.onCreate} />
      </Dialog>
    );
  }
}

TestCaseFormDialog.propTypes = {isVisible: PropTypes.bool, onCancel: PropTypes.func, onCreate: PropTypes.func};
TestCaseFormDialog.defaultProps = {isVisible: false, onCancel: function() {}, onCreate: function() {}};

var TestCaseFormDialogContainer = Relay.createContainer(TestCaseFormDialog, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${TestCaseForm.getFragment('project')}
      }
    `,
  },
});

export default TestCaseFormDialogContainer;
