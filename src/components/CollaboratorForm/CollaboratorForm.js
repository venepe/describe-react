'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaboratorForm.css';
import { FlatButton, TextField } from 'material-ui';
import validator from 'validator';
import {track, Events} from '../../utils/SMTIAnalytics';

import IntroduceCollaboratorMutation from '../../mutations/IntroduceCollaboratorMutation';

class CollaboratorForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onChangeEmail = this._onChangeEmail.bind(this);

    this.state = {
      isDisabled: true,
      email: ''
    }
  }

  _onCreate() {
    let email = this.state.email;
    let isDisabled = this.state.isDisabled;
    if (!isDisabled) {
      Relay.Store.update(
        new IntroduceCollaboratorMutation({email, project: this.props.project})
      );
      //Start SMTIAnalytics
      track(Events.ADDED_COLLABORATOR);
      //End SMTIAnalytics

      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeEmail(e) {
    let email = e.target.value;
    let isDisabled = true;
    let errorMessage = this.state.errorMessage;
    if (validator.isEmail(email)) {
      isDisabled = false;
    }

    this.setState({
      email,
      isDisabled
    });
  }

  render() {

    return (
      <div>
        <div className="collaborator-title"> Email <br/></div>
        <div className="collaborator-label">
          <TextField hintText={'jane@doe.com'} type='text' onChange={this._onChangeEmail} value={this.state.email} fullWidth={true} /> <br/>
        </div>
        <div className="action-container">
          <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancel} />
          <FlatButton label="Create" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }

}

CollaboratorForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func};
CollaboratorForm.defaultProps = {onCancel: function() {}, onCreate: function() {}};

var CollaboratorFormContainer = Relay.createContainer(CollaboratorForm, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${IntroduceCollaboratorMutation.getFragment('project')}
      }
    `,
  },
});

export default CollaboratorFormContainer;
