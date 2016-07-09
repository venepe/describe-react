'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './ContactFormDialog.css';
import ContactForm from '../ContactForm';

import MeRoute from '../../routes/MeRoute';

class ContactFormDialog extends Component {
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
        title="Add Contact"
        open={this.state.isVisible}
        modal={false}>
        <ContactForm me={this.props.me} onCancel={this.props.onCancel} onCreate={this.props.onCreate} />
      </Dialog>
    );
  }
}

export default Relay.createContainer(ContactFormDialog, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        ${ContactForm.getFragment('me')}
      }
    `,
  },
});
