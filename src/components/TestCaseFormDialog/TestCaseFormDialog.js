'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './TestCaseFormDialog.css';
import TestCaseForm from '../TestCaseForm';

import ProjectRoute from '../../routes/ProjectRoute';

class TestCaseFormDialog extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onCreate: PropTypes.func
  }

  static defaultProps = {
    isVisible: false,
    onCancel: function() {},
    onCreate: function() {}
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
        title="Add Test Case"
        open={this.state.isVisible}
        modal={false}>
        <TestCaseForm project={this.props.project} onCancel={this.props.onCancel} onCreate={this.props.onCreate} />
      </Dialog>
    );
  }
}

export default Relay.createContainer(TestCaseFormDialog, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${TestCaseForm.getFragment('project')}
      }
    `,
  },
});
