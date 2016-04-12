'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './RejectionFormDialog.css';
import RejectionForm from '../RejectionForm';

class RejectionFormDialog extends Component {
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
        title="Reject Fulfillment"
        open={this.state.isVisible}
        modal={false}>
        <RejectionForm fulfillment={this.props.fulfillment} testCase={this.props.testCase} project={this.props.project} onCancel={this.props.onCancel} onCreate={this.props.onCreate} />
      </Dialog>
    );
  }
}

export default Relay.createContainer(RejectionFormDialog, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on Fulfillment {
        ${RejectionForm.getFragment('fulfillment')}
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${RejectionForm.getFragment('testCase')}
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${RejectionForm.getFragment('project')}
      }
    `,
  },
});
