'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaborationListCellView.css';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';

import DidDeleteCollaborationSubscription from '../../subscriptions/DidDeleteCollaborationSubscription';

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

  subscribe() {
    if (!this.collaborationSubscription) {
      this.collaborationSubscription = Relay.Store.subscribe(
        new DidDeleteCollaborationSubscription({collaboration: this.props.collaboration, me: this.props.me})
      );
    }
  }

  unsubscribe() {
    if (this.collaborationSubscription) {
      this.collaborationSubscription.dispose();
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
        coverImages(first: 1) {
          edges {
            node {
              uri
            }
          }
        }
        ${DidDeleteCollaborationSubscription.getFragment('collaboration')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${DidDeleteCollaborationSubscription.getFragment('me')},
      }
    `,
  },
});
