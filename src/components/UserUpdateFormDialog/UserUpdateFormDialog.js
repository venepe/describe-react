'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './UserUpdateFormDialog.css';
import UserUpdateForm from '../UserUpdateForm';

import MeRoute from '../../routes/MeRoute';
import EditUserSettingsModal from '../EditUserSettingsModal';

class UserUpdateFormDialog extends Component {
  static propTypes = {
    meId: PropTypes.string,
    onMenuItemClick: PropTypes.func
  }

  static defaultProps = {
    meId: '',
    onMenuItemClick: function() {}
  }

  constructor(props) {
    super(props);
    this.dismiss = this.dismiss.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);

    this.state = {
      meId: props.meIs,
      isOpened: false
    };
  }

  dismiss() {
    this.setState({
      isOpened: false
    });
  }

  _onItemTouchTap(value) {
    this.dismiss();
    this.props.onMenuItemClick(value);
  }

  render() {
    var meId = this.state.meId;
    var meRoute = new MeRoute({meId});
    let editModal = (<div className="modal"><EditUserSettingsModal className="modal" onItemTouchTap={this._onItemTouchTap} /></div>);
    return (
      <Dialog ref="dialog"
        title="Edit Profile"
        open={this.state.isOpened}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        contentClassName="UserUpdateForm-container"
        modal={false}>
        <div style={{height: '315px'}}>
          <Relay.RootContainer Component={UserUpdateForm} route={meRoute} renderFetched={data => <UserUpdateForm {...data} onCancel={this.dismiss} onUpdate={this.dismiss} /> } />
          {editModal}
        </div>
      </Dialog>
    );
  }

  show(meId) {
    this.setState({
      isOpened: true,
      meId
    });
  }
}

export default UserUpdateFormDialog;
