'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaborationListCellView.css';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';
import { isClientID } from '../../utils/isClientID';

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

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
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

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe(prevProps = {}) {
    if(!isClientID(this.props.collaboration.id)) {
      if (prevProps.collaboration !== undefined && prevProps.collaboration.id !== this.props.collaboration.id) {
        this.unsubscribe();
      }

      if (!this.collaborationSubscription) {
        this.collaborationSubscription = Relay.Store.subscribe(
          new DidDeleteCollaborationSubscription({collaboration: this.props.collaboration, me: this.props.me})
        );
      }

      if (!this.projectSubscription) {
        this.projectSubscription = Relay.Store.subscribe(
          new DidUpdateProjectSubscription({project: this.props.collaboration})
        );
      }
    }
  }

  unsubscribe() {
    if (this.collaborationSubscription) {
      this.collaborationSubscription.dispose();
      this.collaborationSubscription = null;
    }

    if (this.projectSubscription) {
      this.projectSubscription.dispose();
      this.projectSubscription = null;
    }
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
