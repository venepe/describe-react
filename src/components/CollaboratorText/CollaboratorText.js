'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaboratorText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import { CollaboratorSheetOptions } from '../../constants/SheetOptions';

import ModalTypes, { DELETE_COLLABORATOR } from '../../constants/ModalTypes';

import { DeleteCollaboratorMutation } from '../../mutations';
import { registerDidDeleteCollaborator } from '../../stores/SubscriptionStore';
import { DidDeleteCollaboratorSubscription } from '../../subscriptions';

class CollaboratorText extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    onClick: function() {},
    onDelete: function() {}
  }

  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.props.collaborator.id);
  }

  _onItemTouchTap(value) {
    switch (value) {
        case DELETE_COLLABORATOR:
            this.props.onDelete(this.props.project.id);
            Relay.Store.commitUpdate(
              new DeleteCollaboratorMutation({collaborator: this.props.collaborator, project: this.props.project})
            );
          break;
      default:
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    let collaborator = this.props.collaborator;
    let project = this.props.project;

    registerDidDeleteCollaborator({collaborator, project}, () => {
      return Relay.Store.subscribe(
        new DidDeleteCollaboratorSubscription({collaborator, project})
      );
    });
  }

  render() {

    return (
      <div className="CollaboratorText-container">
        <ModalableArchyLabel text={this.props.collaborator.name} sheetOptions={CollaboratorSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
      </div>
    );
  }
}

export default Relay.createContainer(CollaboratorText, {
  fragments: {
    collaborator: () => Relay.QL`
      fragment on User {
        id
        name
        ${DeleteCollaboratorMutation.getFragment('collaborator')},
        ${DidDeleteCollaboratorSubscription.getFragment('collaborator')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        ${DeleteCollaboratorMutation.getFragment('project')},
        ${DidDeleteCollaboratorSubscription.getFragment('project')},
      }
    `,
  },
});
