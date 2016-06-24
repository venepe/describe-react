'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './TestCaseUpdateFormDialog.css';
import TestCaseUpdateForm from '../TestCaseUpdateForm';

import TestCaseRoute from '../../routes/TestCaseRoute';

class TestCaseUpdateFormDialog extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func
  }

  static defaultProps = {
    isVisible: false,
    onCancel: function() {},
    onUpdate: function() {}
  }

  constructor(props) {
    super(props);

    this.state = {
      isVisible: props.isVisible
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  render() {

    return (
      <Dialog ref="dialog"
        title="Edit Test Case"
        open={this.state.isVisible}
        modal={false}>
        <TestCaseUpdateForm testCase={this.props.testCase} onCancel={this.props.onCancel} onUpdate={this.props.onUpdate} />
      </Dialog>
    );
  }
}

export default Relay.createContainer(TestCaseUpdateFormDialog, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${TestCaseUpdateForm.getFragment('testCase')}
      }
    `,
  },
});
