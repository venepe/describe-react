'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './InviteeListPage.css';
import InviteeListToolbar from '../InviteeListToolbar';
import InviteeListView from '../InviteeListView';
import InviteeFormDialog from '../InviteeFormDialog';

class InviteeListPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._dismissInviteeForm = this._dismissInviteeForm.bind(this);
    this.introduceInvitee = this.introduceInvitee.bind(this);
    this.state = {
      showInviteeForm: false
    };
  }

  introduceInvitee() {
    this.setState({
      showInviteeForm: true
    });
  }

  _dismissInviteeForm() {
    this.setState({
      showInviteeForm: false
    });
  }

  render() {
    return (
      <div className="InviteeListPage-container">
        <InviteeListToolbar title={'Invited'} onClick={this.introduceInvitee} />
        <InviteeListView project={this.props.project} me={this.props.me} />
        <InviteeFormDialog isVisible={this.state.showInviteeForm} project={this.props.project} onCancel={this._dismissInviteeForm} onCreate={this._dismissInviteeForm} />
      </div>
    );
  }
}

export default Relay.createContainer(InviteeListPage, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        title
        ${InviteeListView.getFragment('project')},
        ${InviteeFormDialog.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${InviteeListView.getFragment('me')},
      }
    `,
  },
});
