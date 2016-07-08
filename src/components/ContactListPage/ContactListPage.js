'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ContactListPage.css';
import ContactListToolbar from '../ContactListToolbar';
import ContactListView from '../ContactListView';

class ContactListPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this.introduceContact = this.introduceContact.bind(this);
  }

  introduceContact() {
    console.log('introduceContact');
  }

  render() {
    return (
      <div className="ContactListPage-container">
        <ContactListToolbar title={'Contacts'} onClick={this.introduceContact} />
        <ContactListView contact={this.props.contact} me={this.props.me} />
      </div>
    );
  }
}

export default Relay.createContainer(ContactListPage, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        ${ContactListView.getFragment('me')},
      }
    `,
  },
});
