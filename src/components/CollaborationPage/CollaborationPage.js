'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaborationPage.css';
import ProjectToolbar from '../ProjectToolbar';
import CollaborationView from '../CollaborationView';

class CollaborationPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushCollaborators = this._pushCollaborators.bind(this);
  }


  _pushCollaborators() {
    let collaborationId = this.props.collaboration.id;
    this.router.push(`/collaborations/${collaborationId}/collaborators`);
  }

  render() {
    return (
      <div className="CollaborationPage-container">
        <ProjectToolbar title={this.props.collaboration.text} onClick={this._pushCollaborators} />
        <CollaborationView collaboration={this.props.collaboration} me={this.props.me} />
      </div>
    );
  }
}

export default Relay.createContainer(CollaborationPage, {
  fragments: {
    collaboration: () => Relay.QL`
      fragment on Project {
        id
        text
        ${CollaborationView.getFragment('collaboration')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${CollaborationView.getFragment('me')},
      }
    `,
  },
});
