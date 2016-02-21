'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './ProjectUpdateFormDialog.css';
import ProjectUpdateForm from '../ProjectUpdateForm';

class ProjectUpdateFormDialog extends Component {
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
        title="Update Project"
        open={this.state.isVisible}
        modal={false}>
        <ProjectUpdateForm project={this.props.project} onCancel={this.props.onCancel} onUpdate={this.props.onUpdate} />
      </Dialog>
    );
  }
}

ProjectUpdateFormDialog.propTypes = {isVisible: PropTypes.bool, onCancel: PropTypes.func, onUpdate: PropTypes.func};
ProjectUpdateFormDialog.defaultProps = {isVisible: false, onCancel: function() {}, onUpdate: function() {}};

var ProjectUpdateFormDialogContainer = Relay.createContainer(ProjectUpdateFormDialog, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${ProjectUpdateForm.getFragment('project')}
      }
    `,
  },
});

export default ProjectUpdateFormDialogContainer;
