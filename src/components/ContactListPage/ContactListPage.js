'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ContactListPage.css';
import ContactListToolbar from '../ContactListToolbar';
import ContactListView from '../ContactListView';
import ContactFormDialog from '../ContactFormDialog';

import { registerDidIntroduceContact } from '../../stores/SubscriptionStore';
import { DidIntroduceContactSubscription } from '../../subscriptions';

class ContactListPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._dismissContactForm = this._dismissContactForm.bind(this);
    this.introduceContact = this.introduceContact.bind(this);
    this.state = {
      showContactForm: false
    };
  }

  introduceContact() {
    this.setState({
      showContactForm: true
    });
  }

  _dismissContactForm() {
    this.setState({
      showContactForm: false
    });
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.me) {
      let me = this.props.me;
      let meId = me.id;

      registerDidIntroduceContact({meId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceContactSubscription({me})
        );
      });
    }
  }

  render() {
    return (
      <div className="ContactListPage-container">
        <ContactListToolbar title={'Contacts'} onClick={this.introduceContact} />
        <ContactListView contact={this.props.contact} me={this.props.me} />
        <ContactFormDialog isVisible={this.state.showContactForm} me={this.props.me} onCancel={this._dismissContactForm} onCreate={this._dismissContactForm} />
      </div>
    );
  }
}

export default Relay.createContainer(ContactListPage, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        ${ContactListView.getFragment('me')},
        ${ContactFormDialog.getFragment('me')},
        ${DidIntroduceContactSubscription.getFragment('me')},
      }
    `,
  },
});
