'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './InviteeForm.css';
import { FlatButton, AutoComplete } from 'material-ui';
import validator from 'validator';
import { track, Events } from '../../utils/SMTIAnalytics';
import { getCollaboratorPlaceholderText } from '../../utils/utilities';
const errorText = 'Unable to send invitation. Verify the email address is correct';
const _first = 30;

import { IntroduceInviteeMutation } from '../../mutations';

class InviteeForm extends Component {
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
    this._findContact = this._findContact.bind(this);

    this.state = {
      isDisabled: true,
      email: '',
      errorText: '',
      placeholder: getCollaboratorPlaceholderText()
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
        track(Events.SENT_INVITATION);
        //End SMTIAnalytics

        this.props.onCreate();
      }

      let onFailure = () => {
        this.setState({
          errorText
        });
      };

      let mutation = new IntroduceInviteeMutation({email, project: this.props.project});

      Relay.Store.commitUpdate(mutation, {onFailure, onSuccess});
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeEmail(email = '') {
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

  _findContact(query) {
    if (query === '') {
      return [];
    }

    const edges = this.props.me.contacts.edges;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return edges.filter(edge => edge.node.email.search(regex) >= 0)
      .map(edge => {return edge.node.email});
  }

  render() {

    const { email } = this.state;
    const contacts = this._findContact(email);

    return (
      <div>
        <div className="invitee-title"> Email <br/></div>
        <div className="invitee-label">
          <AutoComplete
            hintText={this.state.placeholder}
            errorText={this.state.errorText}
            type='text'
            fullWidth={true}
            dataSource={contacts}
            searchText={email}
            onUpdateInput={this._onChangeEmail}
            onNewRequest={this._onChangeEmail}
            />
        </div>
        <div className="action-container">
          <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancel} />
          <FlatButton label="Send" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }

}

export default Relay.createContainer(InviteeForm, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        ${IntroduceInviteeMutation.getFragment('project')}
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
        contacts (first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              email
            }
          }
        }
      }
    `,
  },
});
