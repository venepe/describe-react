'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './ProjectUpdateFormDialog.css';
import ProjectUpdateForm from '../ProjectUpdateForm';

class ProjectUpdateFormDialog extends Component {
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
        title="Update Project"
        open={this.state.isVisible}
        modal={false}>
        <ProjectUpdateForm project={this.props.project} onCancel={this.props.onCancel} onUpdate={this.props.onUpdate} />
      </Dialog>
    );
  }
}

export default Relay.createContainer(ProjectUpdateFormDialog, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${ProjectUpdateForm.getFragment('project')}
      }
    `,
  },
});
