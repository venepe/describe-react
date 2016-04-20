'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaboratorListPage.css';
import CollaboratorListToolbar from '../CollaboratorListToolbar';
import CollaboratorListView from '../CollaboratorListView';
import CollaboratorFormDialog from '../CollaboratorFormDialog';

class CollaboratorListPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._dismissCollaboratorForm = this._dismissCollaboratorForm.bind(this);
    this.introduceCollaborator = this.introduceCollaborator.bind(this);
    this.state = {
      showCollaboratorForm: false
    };
  }

  introduceCollaborator() {
    this.setState({
      showCollaboratorForm: true
    });
  }

  _dismissCollaboratorForm() {
    this.setState({
      showCollaboratorForm: false
    });
  }

  render() {
    return (
      <div className="CollaboratorListPage-container">
        <CollaboratorListToolbar title={'Collaborators'} onClick={this.introduceCollaborator} />
        <CollaboratorListView project={this.props.project} me={this.props.me} />
        <CollaboratorFormDialog isVisible={this.state.showCollaboratorForm} project={this.props.project} onCancel={this._dismissCollaboratorForm} onCreate={this._dismissCollaboratorForm} />
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
        ${CollaboratorFormDialog.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${CollaboratorListView.getFragment('me')},
      }
    `,
  },
});
