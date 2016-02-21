'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './CollaboratorFormDialog.css';
import CollaboratorForm from '../CollaboratorForm';

import ProjectRoute from '../../routes/ProjectRoute';

class CollaboratorFormDialog extends Component {
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
        title="Add Collaborator"
        open={this.state.isVisible}
        modal={false}>
        <CollaboratorForm project={this.props.project} onCancel={this.props.onCancel} onCreate={this.props.onCreate} />
      </Dialog>
    );
  }
}

CollaboratorFormDialog.propTypes = {isVisible: PropTypes.bool, onCancel: PropTypes.func, onCreate: PropTypes.func};
CollaboratorFormDialog.defaultProps = {isVisible: false, onCancel: function() {}, onCreate: function() {}};

var CollaboratorFormDialogContainer = Relay.createContainer(CollaboratorFormDialog, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${CollaboratorForm.getFragment('project')}
      }
    `,
  },
});

export default CollaboratorFormDialogContainer;
