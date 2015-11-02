'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './UserUpdateFormDialog.css';
import UserUpdateForm from '../UserUpdateForm';

import MeRoute from '../../routes/MeRoute';

class UserUpdateFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);

    this.state = {
      meId: props.meId
    };
  }

  _onUpdate() {
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
        title="Edit Profile"
        modal={false}>
        <Relay.RootContainer Component={UserUpdateForm} route={meRoute} renderFetched={data => <UserUpdateForm {...data} onCancel={this._onCancel} onUpdate={this._onUpdate} /> } />
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

UserUpdateFormDialog.propTypes = {meId: PropTypes.string};
UserUpdateFormDialog.defaultProps = {meId: ''};

export default UserUpdateFormDialog;
