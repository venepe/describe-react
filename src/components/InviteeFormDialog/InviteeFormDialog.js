'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './InviteeFormDialog.css';
import InviteeForm from '../InviteeForm';

import ProjectRoute from '../../routes/ProjectRoute';

class InviteeFormDialog extends Component {
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
        title="Invite"
        open={this.state.isVisible}
        modal={false}>
        <InviteeForm project={this.props.project} onCancel={this.props.onCancel} onCreate={this.props.onCreate} />
      </Dialog>
    );
  }
}

export default Relay.createContainer(InviteeFormDialog, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${InviteeForm.getFragment('project')}
      }
    `,
  },
});
