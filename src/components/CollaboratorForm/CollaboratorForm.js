'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaboratorForm.css';
import { FlatButton, TextField } from 'material-ui';
import validator from 'validator';
import { track, Events } from '../../utils/SMTIAnalytics';
const errorText = 'Unable to add collaborator. Verify the email address is correct';

import { IntroduceCollaboratorMutation } from '../../mutations';

class CollaboratorForm extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onCreate: PropTypes.func
  }

  static defaultProps = {
    onCancel: function() {},
    onCreate: function() {}
  }

  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onChangeEmail = this._onChangeEmail.bind(this);

    this.state = {
      isDisabled: true,
      email: '',
      errorText: ''
    }
  }

  _onCreate() {
    let email = this.state.email;
    let isDisabled = this.state.isDisabled;
    if (!isDisabled) {
      this.setState({
        isDisabled: true
      });

      let onSuccess = () => {
        //Start SMTIAnalytics
        track(Events.ADDED_COLLABORATOR);
        //End SMTIAnalytics

        this.props.onCreate();
      }

      let onFailure = () => {
        this.setState({
          errorText
        });
      };

      let mutation = new IntroduceCollaboratorMutation({email, project: this.props.project});

      Relay.Store.commitUpdate(mutation, {onFailure, onSuccess});
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeEmail(e) {
    let email = e.target.value;
    let isDisabled = true;
    let errorText = '';
    let errorMessage = this.state.errorMessage;
    if (validator.isEmail(email)) {
      isDisabled = false;
    }

    this.setState({
      email,
      isDisabled,
      errorText
    });
  }

  render() {

    return (
      <div>
        <div className="collaborator-title"> Email <br/></div>
        <div className="collaborator-label">
          <TextField hintText={'jane@doe.com'} errorText={this.state.errorText} type='text' onChange={this._onChangeEmail} value={this.state.email} fullWidth={true} /> <br/>
        </div>
        <div className="action-container">
          <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancel} />
          <FlatButton label="Add" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }

}

export default Relay.createContainer(CollaboratorForm, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${IntroduceCollaboratorMutation.getFragment('project')}
      }
    `,
  },
});
