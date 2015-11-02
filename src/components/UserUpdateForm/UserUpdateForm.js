'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FlatButton, TextField } from 'material-ui';
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './UserUpdateForm.css';

import UpdateUserMutation from '../../mutations/UpdateUserMutation';

class UserUpdateForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onChangeUsername = this._onChangeUsername.bind(this);
    this._onChangeSummary = this._onChangeSummary.bind(this);
    this._onChangeFullname = this._onChangeFullname.bind(this);

    let isDisabled = true;
    if (props.me.username.length > 5) {
      isDisabled = false;
    }

    this.state = {
      username: props.me.username,
      fullName: props.me.fullName,
      summary: props.me.summary,
      isDisabled: isDisabled
    }
  }

  _onChangeUsername(e) {
    let username = e.target.value;
    let isDisabled = true;
    if (username.length > 5) {
      isDisabled = false;
    }
    this.setState({username, isDisabled});
  }

  _onChangeSummary(e) {
    let summary = e.target.value;
    this.setState({summary});
  }

  _onChangeFullname(e) {
    let fullName = e.target.value;
    this.setState({fullName});
  }

  _onUpdate() {
    let username = this.state.username;
    let fullName = this.state.fullName;
    let summary = this.state.summary;
    if (username.length > 5) {
      Relay.Store.update(
        new UpdateUserMutation({username, fullName, summary, user: this.props.me})
      );
      this.props.onUpdate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  render() {
    return (
      <div>
        <div>
          <div className="label">Username</div>
          <div className="text-field">
            <TextField hintText={'Username'} type='text' onChange={this._onChangeUsername} value={this.state.username} fullWidth={true} /> <br/>
          </div>
          <div className="label">Full Name</div>
          <div className="text-field">
            <TextField hintText={'Full name'} type='text' onChange={this._onChangeFullname} value={this.state.fullName} fullWidth={true} /> <br/>
          </div>
          <div className="label">Summary</div>
          <div className="text-field">
            <TextField hintText={'Summary'} multiLine={true} type='text' onChange={this._onChangeSummary} value={this.state.summary} fullWidth={true} /> <br/>
          </div>
        </div>
        <div className="action-container">
          <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancel} />
          <FlatButton label="Update" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onUpdate} />
        </div>
      </div>
    );
  }
}

UserUpdateForm.propTypes = {onCancel: PropTypes.func, onUpdate: PropTypes.func};
UserUpdateForm.defaultProps = {onCancel: function() {}, onUpdate: function() {}};

let UserUpdateFormContainer = Relay.createContainer(UserUpdateForm, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        username
        email
        fullName
        summary
        ${UpdateUserMutation.getFragment('user')}
      }
    `,
  },
});

export default UserUpdateFormContainer;
