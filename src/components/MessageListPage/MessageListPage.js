'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import styles from './MessageListPage.css';
import MessageListView from '../MessageListView';
import MessageListToolbar from '../MessageListToolbar';
import MessageFormDialog from '../MessageFormDialog';

class MessageListPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this.introduceMessage = this.introduceMessage.bind(this);
    this._dismissMessageForm = this._dismissMessageForm.bind(this);
    this.state = {
      showMessageForm: false
    };
  }

  introduceMessage() {
    this.setState({
      showMessageForm: true
    });
  }

  _dismissMessageForm() {
    this.setState({
      showMessageForm: false
    });
  }

  render() {
    return (
      <div className="MessageListPage-container">
        <MessageListToolbar title={'Messages'} onClick={this.introduceMessage} />
        <MessageListView channel={this.props.channel}/>
        <MessageFormDialog isVisible={this.state.showMessageForm} channel={this.props.channel} onCancel={this._dismissMessageForm} onCreate={this._dismissMessageForm} />
      </div>
    );
  }
}

export default Relay.createContainer(MessageListPage, {
  fragments: {
    channel: () => Relay.QL`
      fragment on Channel {
        id
        ${MessageListView.getFragment('channel')},
        ${MessageFormDialog.getFragment('channel')},
      }
    `,
  },
});
