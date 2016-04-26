'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaborationListCellView.css';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';

import { registerDidDeleteCollaboration, registerDidUpdateProject } from '../../stores/SubscriptionStore';
import { DidDeleteCollaborationSubscription, DidUpdateProjectSubscription } from '../../subscriptions';

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
  }

  _onClick() {
    this.props.onClick(this.props.collaboration);
    this.renderBuiltWith = this.renderBuiltWith.bind(this);
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
        return(<img style={{float: 'left', marginLeft: 10, borderRadius: '50%',}} height={20} width={20} src={collaborator.profile.cover.uri} />)
      });
    } else {
      return [];
    }
  }

  render() {
    let collaboration = this.props.collaboration;
    let subtitleText = `${collaboration.numOfTestCasesFulfilled}/${collaboration.numOfTestCases}`;
    let subtitle = (<div><div style={{float: 'left', paddingBottom: 16}}>{subtitleText}</div>{this.renderBuiltWith()}</div>)
    return (
      <Card key={this.props.key} className="clickable" onClick={this._onClick}>
        <CardTitle title={collaboration.title} subtitle={subtitle} />
      </Card>
    );
  }
}

export default Relay.createContainer(CollaborationListCellView, {
  fragments: {
    collaboration: () => Relay.QL`
      fragment on Project {
        id
        title
        numOfTestCases
        numOfTestCasesFulfilled
        collaborators (first: 5) {
          edges {
            node {
              profile {
                cover {
                  id
                  uri
                }
              }
            }
          }
        }
        ${DidDeleteCollaborationSubscription.getFragment('collaboration')},
        ${DidUpdateProjectSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DidDeleteCollaborationSubscription.getFragment('me')},
      }
    `,
  },
});
