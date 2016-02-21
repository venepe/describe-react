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
    this.dismiss = this.dismiss.bind(this);
    this.show = this.show.bind(this);

    this.state = {
      meId: props.meId,
      isOpened: false
    };
  }

  render() {
    var meId = this.state.meId;
    var meRoute = new MeRoute({meId});

    return (
      <Dialog ref="dialog"
        title="Start Project"
        open={this.state.isOpened}
        modal={false}>
        <Relay.RootContainer Component={ProjectForm} route={meRoute} renderFetched={data => <ProjectForm {...data} onCancel={this.dismiss} onCreate={this.dismiss} /> } />
      </Dialog>
    );
  }

  show(meId) {
    this.setState({
      isOpened: true,
      meId
    });
  }

  dismiss() {
    this.setState({
      isOpened: false
    });
  }
}

ProjectFormDialog.propTypes = {meId: PropTypes.string};
ProjectFormDialog.defaultProps = {meId: ''};

export default ProjectFormDialog;
