'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './ProjectUpdateFormDialog.css';
import ProjectUpdateForm from '../ProjectUpdateForm';

import ProjectRoute from '../../routes/ProjectRoute';

class ProjectUpdateFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);

    this.state = {
      projectId: props.projectId
    };
  }

  _onUpdate() {
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
        title="Update Project"
        modal={false}>
        <Relay.RootContainer Component={ProjectUpdateForm} route={projectRoute} renderFetched={data => <ProjectUpdateForm {...data} onCancel={this._onCancel} onUpdate={this._onUpdate} /> } />
      </Dialog>
    );
  }

  show(projectId) {
    this.setState({
      projectId
    });
    this.refs.dialog.show();
  }
}

ProjectUpdateFormDialog.propTypes = {projectId: PropTypes.string};
ProjectUpdateFormDialog.defaultProps = {projectId: ''};

export default ProjectUpdateFormDialog;
