'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './UserUpdateFormDialog.css';
import UserUpdateForm from '../UserUpdateForm';

import MeRoute from '../../routes/MeRoute';
import EditUserSettingsModal from '../EditUserSettingsModal';

class UserUpdateFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);

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

  _onItemTouchTap(value) {
    this.refs.dialog.dismiss();
    this.props.onMenuItemClick(value);
  }

  render() {
    var meId = this.state.meId;
    var meRoute = new MeRoute({meId});
    let editModal = (<div className="modal"><EditUserSettingsModal className="modal" onItemTouchTap={this._onItemTouchTap} /></div>);
    return (
      <Dialog ref="dialog"
        title="Edit Profile"
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        contentClassName="UserUpdateForm-container"
        modal={false}>
        <div style={{height: '315px'}}>
          <Relay.RootContainer Component={UserUpdateForm} route={meRoute} renderFetched={data => <UserUpdateForm {...data} onCancel={this._onCancel} onUpdate={this._onUpdate} /> } />
          {editModal}
        </div>
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

UserUpdateFormDialog.propTypes = {meId: PropTypes.string, onMenuItemClick: PropTypes.func};
UserUpdateFormDialog.defaultProps = {meId: '', onMenuItemClick: function() {}};

export default UserUpdateFormDialog;
