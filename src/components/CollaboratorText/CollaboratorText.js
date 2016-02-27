'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaboratorText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import SheetOptions from '../../constants/SheetOptions';

import ModalTypes, { DELETE_COLLABORATOR } from '../../constants/ModalTypes';

import DeleteCollaboratorMutation from '../../mutations/DeleteCollaboratorMutation';

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

  render() {

    return (
      <div className="CollaboratorText-container">
        <ModalableArchyLabel text={this.props.collaborator.name} sheetOptions={SheetOptions.collaboratorSheet} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
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
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${DeleteCollaboratorMutation.getFragment('project')},
      }
    `,
  },
});
