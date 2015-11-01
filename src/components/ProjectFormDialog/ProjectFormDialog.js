'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './ProjectFormDialog.css';
import ProjectForm from '../ProjectForm';

import MeRoute from '../../routes/MeRoute';

class ProjectFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);

    this.state = {
      meId: props.meId
    };
  }

  _onCreate() {
    this.refs.dialog.dismiss();
  }

  _onCancel() {
    this.refs.dialog.dismiss();
  }

  render() {
    var meId = this.state.meId;
    var meRoute = new MeRoute({meId});

    return (
      <Dialog ref="dialog"
        title="Start Project"
        modal={false}>
        <Relay.RootContainer Component={ProjectForm} route={meRoute} renderFetched={data => <ProjectForm {...data} onCancel={this._onCancel} onCreate={this._onCreate} /> } />
      </Dialog>
    );
  }

  show(meId) {
    this.setState({
      meId
    });
    this.refs.dialog.show();
  }
}

ProjectFormDialog.propTypes = {meId: PropTypes.string};
ProjectFormDialog.defaultProps = {meId: ''};

export default ProjectFormDialog;
