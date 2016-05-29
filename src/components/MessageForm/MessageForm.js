'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './MessageForm.css';
import { FlatButton, TextField } from 'material-ui';
import { isValidMessage } from '../../utils/utilities';
import { track, Events } from '../../utils/SMTIAnalytics';

import { IntroduceMessageMutation } from '../../mutations';

class MessageForm extends Component {
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
    this._onChangeText = this._onChangeText.bind(this);

    this.state = {
      isDisabled: true,
      text: '',
      placeholder: 'Type a message...'
    }
  }

  _onCreate() {
    var text = this.state.text;
    if (isValidMessage(text)) {
      Relay.Store.commitUpdate(
        new IntroduceMessageMutation({text, channel: this.props.channel})
      );
      //Start SMTIAnalytics
      track(Events.ADDED_MESSAGE);
      //End SMTIAnalytics

      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeText(e) {
    let text = e.target.value;
    let isDisabled = true;
    if (isValidMessage(text)) {
      isDisabled = false;
    }

    this.setState({
      text,
      isDisabled,
    });
  }

  render() {

    return (
      <div>
        <div className="message-title"> Message <br/></div>
        <div className="message-label">
          <TextField hintText={this.state.placeholder} type='text' onChange={this._onChangeText} value={this.state.text} fullWidth={true} /> <br/>
        </div>
        <div className="action-container">
          <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancel} />
          <FlatButton label="Send" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }

}

export default Relay.createContainer(MessageForm, {
  fragments: {
    channel: () => Relay.QL`
      fragment on Channel {
        ${IntroduceMessageMutation.getFragment('channel')}
      }
    `,
  },
});
