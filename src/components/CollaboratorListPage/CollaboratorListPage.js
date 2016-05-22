'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaboratorListPage.css';
import CollaboratorListToolbar from '../CollaboratorListToolbar';
import CollaboratorListView from '../CollaboratorListView';

class CollaboratorListPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushInvitees = this._pushInvitees.bind(this);
  }


  _pushInvitees() {
    let projectId = this.props.project.id;
    this.router.push(`/projects/${projectId}/invitees`);
  }

  render() {
    return (
      <div className="CollaboratorListPage-container">
        <CollaboratorListToolbar title={'Collaborators'} onClick={this._pushInvitees} />
        <CollaboratorListView project={this.props.project} me={this.props.me} />
      </div>
    );
  }
}

export default Relay.createContainer(CollaboratorListPage, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        title
        ${CollaboratorListView.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${CollaboratorListView.getFragment('me')},
      }
    `,
  },
});
