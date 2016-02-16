'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FlatButton, TextField } from 'material-ui';
let MenuDivider = require('material-ui/lib/menus/menu-divider');
import styles from './UserUpdateForm.css';
import {track, Events} from '../../utils/SMTIAnalytics';
import Utilities from '../../utils/utilities';

import UpdateUserMutation from '../../mutations/UpdateUserMutation';

class UserUpdateForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onChangeName = this._onChangeName.bind(this);
    this._onChangeSummary = this._onChangeSummary.bind(this);
    this._onChangeFullname = this._onChangeFullname.bind(this);

    let isDisabled = true;
    if (props.me.name.length > 5) {
      isDisabled = false;
    }

    this.state = {
      name: props.me.name,
      fullName: props.me.fullName,
      summary: props.me.summary,
      isDisabled: isDisabled
    }
  }

  _onChangeName(e) {
    let name = e.target.value;
    let isDisabled = true;
    if (Utilities.isValidName(name)) {
      isDisabled = false;
    }
    this.setState({name, isDisabled});
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
    let name = this.state.name;
    let fullName = this.state.fullName;
    let summary = this.state.summary;
    if (name.length > 5) {
      Relay.Store.update(
        new UpdateUserMutation({name, fullName, summary, user: this.props.me})
      );
      //Start SMTIAnalytics
      track(Events.UPDATED_PROFILE);
      //End SMTIAnalytics

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
            <TextField hintText={'Username'} type='text' onChange={this._onChangeName} value={this.state.name} fullWidth={true} /> <br/>
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
        name
        email
        fullName
        summary
        ${UpdateUserMutation.getFragment('user')}
      }
    `,
  },
});

export default UserUpdateFormContainer;
