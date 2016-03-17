'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaboratorText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import { CollaboratorSheetOptions } from '../../constants/SheetOptions';
import { isClientID } from '../../utils/isClientID';

import ModalTypes, { DELETE_COLLABORATOR } from '../../constants/ModalTypes';

import { DeleteCollaboratorMutation } from '../../mutations';
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

  componentDidUpdate(prevProps) {
    this.subscribe(prevProps);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe(prevProps = {}) {
    if(!isClientID(this.props.collaborator.id)) {
      if (prevProps.collaborator !== undefined && prevProps.collaborator.id !== this.props.collaborator.id) {
        this.unsubscribe();
      }

      if (!this.collaboratorSubscription) {
        this.collaboratorSubscription = Relay.Store.subscribe(
          new DidDeleteCollaboratorSubscription({collaborator: this.props.collaborator, project: this.props.project})
        );
      }
    }
  }

  unsubscribe() {
    if (this.collaboratorSubscription) {
      this.collaboratorSubscription.dispose();
      this.collaboratorSubscription = null;
    }
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
        ${DeleteCollaboratorMutation.getFragment('project')},
        ${DidDeleteCollaboratorSubscription.getFragment('project')},
      }
    `,
  },
});
