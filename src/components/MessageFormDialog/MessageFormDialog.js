'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './MessageFormDialog.css';
import MessageForm from '../MessageForm';

import ChannelRoute from '../../routes/ChannelRoute';

class MessageFormDialog extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onCreate: PropTypes.func
  }

  static defaultProps = {
    isVisible: false,
    onCancel: function() {},
    onCreate: function() {}
  }

  constructor(props) {
    super(props);

    this.state = {
      isVisible: props.isVisible
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  render() {

    return (
      <Dialog ref="dialog"
        title="Message"
        open={this.state.isVisible}
        modal={false}>
        <MessageForm channel={this.props.channel} onCancel={this.props.onCancel} onCreate={this.props.onCreate} />
      </Dialog>
    );
  }
}

export default Relay.createContainer(MessageFormDialog, {
  fragments: {
    channel: () => Relay.QL`
      fragment on Channel {
        ${MessageForm.getFragment('channel')}
      }
    `,
  },
});
