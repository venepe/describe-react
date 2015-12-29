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
        title="Update Test Case"
        modal={false}>
        <TestCaseUpdateForm testCase={this.props.testCase} onCancel={this.props.onCancel} onUpdate={this.props.onUpdate} />
      </Dialog>
    );
  }
}

TestCaseUpdateFormDialog.propTypes = {isVisible: PropTypes.bool, onCancel: PropTypes.func, onUpdate: PropTypes.func};
TestCaseUpdateFormDialog.defaultProps = {isVisible: false, onCancel: function() {}, onUpdate: function() {}};

var TestCaseUpdateFormDialogContainer = Relay.createContainer(TestCaseUpdateFormDialog, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${TestCaseUpdateForm.getFragment('testCase')}
      }
    `,
  },
});

export default TestCaseUpdateFormDialogContainer;
