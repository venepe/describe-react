'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import Infinite from 'react-infinite';
import styles from './CollaboratorListView.css';
import SpinnerView from '../SpinnerView';
import CollaboratorListToolbar from '../CollaboratorListToolbar';
import CollaboratorListCellView from '../CollaboratorListCellView';
import CollaboratorListPlaceholder from '../CollaboratorListPlaceholder';

const _first = 10;
const _next = 10;

class CollaboratorListView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    onPressRow: PropTypes.func,
    onEndReached: PropTypes.func
  }

  static defaultProps = {
    onPressRow: function() {},
    onEndReached: function() {}
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._getInitialState = this._getInitialState.bind(this);
    this.buildElements = this.buildElements.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._onClick = this._onClick.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      hasNextPage: false,
      elements: this.buildElements(this.props.project.collaborators)
    };
  }

  _getUpdatedState(collaborators) {
    return {
      hasNextPage: false,
      elements: this.buildElements(collaborators)
    };
  }

  _onClick(collaborator) {
    let userId = collaborator.profile.id;
    this.router.push(`/users/${userId}`);
  }

  buildElements(collaborators) {
    return collaborators.edges.map((object, index) => {
      let collaborator = object.node;

      return (
        <CollaboratorListCellView key={index} collaborator={collaborator} project={this.props.project} onClick={this._onClick} />
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project) {
      this.setState(this._getUpdatedState(nextProps.project.collaborators));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.project.collaborators.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.project.collaborators.edges;
    if (edges.length > 0) {
      let cursor = edges[edges.length - 1].cursor;
      let first = this.props.relay.variables.first;
      this.props.relay.setVariables({
        first: first + _next,
        after: cursor
      });
    }
  }

  elementInfiniteLoad() {
      return (
          <SpinnerView />
      );
  }

  render() {
    if (this.props.project.collaborators.edges.length > 0) {
      return (
          <Infinite elementHeight={97}
                           containerHeight={window.screen.height}
                           infiniteLoadBeginBottomOffset={200}
                           onInfiniteLoad={this._onEndReached}
                           loadingSpinnerDelegate={this.elementInfiniteLoad()}
                           isInfiniteLoading={this.state.hasNextPage}
                           useWindowAsScrollContainer={true}
                           >
              {this.state.elements}
          </Infinite>
      );
    } else {
      return (<CollaboratorListPlaceholder />);
    }
  }
}

export default Relay.createContainer(CollaboratorListView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        collaborators (first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${CollaboratorListCellView.getFragment('collaborator')},
            }
          }
        }
        moreCollaborators: collaborators(first: $moreFirst, after: $after) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${CollaboratorListCellView.getFragment('collaborator')},
            }
          }
        }
        ${CollaboratorListCellView.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
});
