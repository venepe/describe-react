'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './PaperFormDialog.css';
import PaperForm from '../PaperForm';

const TargetRoute = require('../../routes/TargetRoute');

class PaperFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this.state = {
      targetId: props.targetId
    };
  }

  _onCreate() {
    this.refs.dialog.dismiss();
  }

  _onCancel() {
    this.refs.dialog.dismiss();
  }

  render() {
    var targetId = this.state.targetId;
    var targetRoute = new TargetRoute({targetId});

    return (
      <Dialog ref="dialog"
        title="Add Paper"
        modal={false}>
        <Relay.RootContainer Component={PaperForm} route={targetRoute} renderFetched={data => <PaperForm {...data} onCancel={this._onCancel} onCreate={this._onCreate} /> } />
      </Dialog>
    );
  }

  show(targetId) {
    this.setState({
      targetId
    });
    this.refs.dialog.show();
  }
}

PaperFormDialog.propTypes = {targetId: PropTypes.string};
PaperFormDialog.defaultProps = {targetId: ''};

export default PaperFormDialog;
