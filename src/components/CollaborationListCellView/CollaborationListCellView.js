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
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prevProps) {
    this.subscribe(prevProps);
  }

  subscribe(prevProps = {}) {
    let collaboration = this.props.collaboration;
    let me = this.props.me;
    registerDidUpdateProject({project: collaboration}, () => {
      return Relay.Store.subscribe(
        new DidUpdateProjectSubscription({project: collaboration})
      );
    });
    registerDidDeleteCollaboration({collaboration, me}, () => {
      return Relay.Store.subscribe(
        new DidDeleteCollaborationSubscription({collaboration, me})
      );
    });
  }

  render() {
    let collaboration = this.props.collaboration;
    let uri = ''
    if (collaboration.coverImages && collaboration.coverImages.edges.length > 0) {
      uri = collaboration.coverImages.edges[0].node.uri;
    }
    let subtitle = `${collaboration.numOfTestCasesFulfilled}/${collaboration.numOfTestCases}`;
    return (
      <Card key={this.props.key} className="clickable" onClick={this._onClick}>
        <div>
          <CardMedia className='CoverImage-container' expandable={true}>
            <img className='CoverImage-img' height={400} src={uri} />
          </CardMedia>
        </div>
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
        coverImages(last: 1) {
          edges {
            node {
              uri
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
