'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaborationListCellView.css';
import { Card, CardTitle, CardText } from 'material-ui';
import { CollaborationListCellSheetOptions } from '../../constants/SheetOptions';
import CollaboratorIcon from '../CollaboratorIcon';
import SettingsButton from '../SettingsButton';
import ConfirmationDialog from '../ConfirmationDialog';

import ModalTypes, { LEAVE_PROJECT } from '../../constants/ModalTypes';

import { DeleteCollaborationMutation } from '../../mutations';

import { registerDidIntroduceCollaborator, registerDidDeleteCollaboration, registerDidUpdateProject } from '../../stores/SubscriptionStore';
import { DidIntroduceCollaboratorSubscription, DidDeleteCollaborationSubscription, DidUpdateProjectSubscription } from '../../subscriptions';

class CollaborationListCellView extends Component {
  static propTypes = {
    key: PropTypes.number,
    onClick: PropTypes.func
  }

  static defaultProps = {
    key: 0,
    onClick: function() {}
  }

  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._onLeave = this._onLeave.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this.renderBuiltWith = this.renderBuiltWith.bind(this);
    this._onStopPropogation = this._onStopPropogation.bind(this);
    this.state = {
      showConfirmationDialog: false
    }
  }

  _onClick() {
    this.props.onClick(this.props.collaboration);
    this._onLeave = this._onLeave.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this.renderBuiltWith = this.renderBuiltWith.bind(this);
    this._onStopPropogation = this._onStopPropogation.bind(this);
    this.state = {
      showConfirmationDialog: false
    }
  }

  _onItemTouchTap(value) {
    switch (value) {
        case LEAVE_PROJECT:
            this.setState({
              showConfirmationDialog: true
            });
          break;
      default:
    }
  }

  _dismissConfirmationDialog() {
    this.setState({
      showConfirmationDialog: false
    });
  }

  _onLeave() {
    this._dismissConfirmationDialog();
    Relay.Store.commitUpdate(
      new DeleteCollaborationMutation({collaboration: this.props.collaboration, me: this.props.me})
    );
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.collaboration && this.props.me) {
      let collaboration = this.props.collaboration;
      let me = this.props.me;
      let collaborationId = collaboration.id;
      let meId = me.id;

      registerDidIntroduceCollaborator({projectId: collaborationId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceCollaboratorSubscription({project: collaboration})
        );
      });
      registerDidUpdateProject({projectId: collaborationId}, () => {
        return Relay.Store.subscribe(
          new DidUpdateProjectSubscription({project: collaboration})
        );
      });
      registerDidDeleteCollaboration({collaborationId, meId}, () => {
        return Relay.Store.subscribe(
          new DidDeleteCollaborationSubscription({collaboration, me})
        );
      });
    }
  }

  renderBuiltWith() {
    let collaboration = this.props.collaboration;
    if (collaboration.collaborators && collaboration.collaborators.edges.length > 0) {
      return collaboration.collaborators.edges.map(function (object, index) {
        let collaborator = object.node;
        return(<CollaboratorIcon key={index} collaborator={collaborator} project={collaboration} />)
      });
    } else {
      return [];
    }
  }

  _onStopPropogation(e) {
    e.stopPropagation();
  }

  render() {
    let collaboration = this.props.collaboration;
    let percentFulfilled = parseInt(collaboration.numOfTestCasesFulfilled / collaboration.numOfTestCases * 100) || 0;
    let color = percentFulfilled < 50 ? '#FF5252' : percentFulfilled < 80 ? '#FFD740' : '#69F0AE';

    let subtitleText = `${collaboration.numOfTestCasesFulfilled}/${collaboration.numOfTestCases}`;
    let subtitle = (<div><div style={{float: 'left', paddingBottom: 16}}>{subtitleText}</div>{this.renderBuiltWith()}<div style={{float: 'right', paddingBottom: 16, fontSize: 18, color}}>{percentFulfilled}%</div></div>)
    return (
      <Card key={this.props.key} className="clickable" onClick={this._onClick}>
        <div className="settings-btn" onClick={this._onStopPropogation}>
          <SettingsButton sheetOptions={CollaborationListCellSheetOptions} onItemTouchTap={this._onItemTouchTap} />
        </div>
        <CardTitle title={collaboration.text} subtitle={subtitle} style={{padding: '0px', margin: '16px'}} />
        <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Leave Project?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onLeave} />
      </Card>
    );
  }
}

export default Relay.createContainer(CollaborationListCellView, {
  fragments: {
    collaboration: () => Relay.QL`
      fragment on Project {
        id
        text
        numOfTestCases
        numOfTestCasesFulfilled
        collaborators (first: 5) {
          edges {
            node {
              ${CollaboratorIcon.getFragment('collaborator')}
            }
          }
        }
        ${CollaboratorIcon.getFragment('project')}
        ${DeleteCollaborationMutation.getFragment('collaboration')},
        ${DidDeleteCollaborationSubscription.getFragment('collaboration')},
        ${DidUpdateProjectSubscription.getFragment('project')},
        ${DidIntroduceCollaboratorSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DeleteCollaborationMutation.getFragment('me')},
        ${DidDeleteCollaborationSubscription.getFragment('me')},
      }
    `,
  },
});
