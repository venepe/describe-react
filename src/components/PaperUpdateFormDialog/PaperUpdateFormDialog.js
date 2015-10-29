'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './PaperUpdateFormDialog.css';
import PaperUpdateForm from '../PaperUpdateForm';

import PaperRoute from '../../routes/PaperRoute';

class PaperUpdateFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this.state = {
      paperId: props.paperId
    };
  }

  _onUpdate() {
    this.refs.dialog.dismiss();
  }

  _onCancel() {
    this.refs.dialog.dismiss();
  }

  render() {
    var paperId = this.state.paperId;
    var paperRoute = new PaperRoute({paperId});

    return (
      <Dialog ref="dialog"
        title="Update Paper"
        modal={false}>
        <Relay.RootContainer Component={PaperUpdateForm} route={paperRoute} renderFetched={data => <PaperUpdateForm {...data} onCancel={this._onCancel} onUpdate={this._onUpdate} /> } />
      </Dialog>
    );
  }

  show(paperId) {
    this.setState({
      paperId
    });
    this.refs.dialog.show();
  }
}

PaperUpdateFormDialog.propTypes = {paperId: PropTypes.string};
PaperUpdateFormDialog.defaultProps = {paperId: ''};

export default PaperUpdateFormDialog;
