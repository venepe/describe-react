'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Card, CardHeader } from 'material-ui';
import ConfirmationDialog from '../ConfirmationDialog';
import DeleteButton from '../DeleteButton';
import styles from './ContactListCellView.css';

import { DeleteContactMutation } from '../../mutations';

class ContactListCellView extends Component {
  constructor(props) {
    super(props);
    this._onDelete = this._onDelete.bind(this);
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this._showConfirmationDialog = this._showConfirmationDialog.bind(this);
    this.state = {
      showConfirmationDialog: false
    };
  }

  _showConfirmationDialog() {
    this.setState({
      showConfirmationDialog: true
    });
  }

  _dismissConfirmationDialog() {
    this.setState({
      showConfirmationDialog: false
    });
  }

  _onDelete() {
    this._dismissConfirmationDialog();
    Relay.Store.commitUpdate(
      new DeleteContactMutation({contact: this.props.contact, me: this.props.me})
    );
  }

  render() {
    let contact = this.props.contact;
    let marginRight = 30;

    return (
      <Card>
        <DeleteButton onClick={this._showConfirmationDialog} />
        <CardHeader style={{marginRight}} title={contact.name} subtitle={contact.email} avatar={contact.cover.uri} className="clickable" onClick={() => this.props.onClick(contact)}>
        </CardHeader>
        <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Delete Contact?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onDelete} />
      </Card>
    );
  }
}

export default Relay.createContainer(ContactListCellView, {
  fragments: {
    contact: () => Relay.QL`
      fragment on User {
        id
        name
        email
        cover {
          id
          uri
        }
        ${DeleteContactMutation.getFragment('contact')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DeleteContactMutation.getFragment('me')},
      }
    `,
  },
});
