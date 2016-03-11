'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Infinite from 'react-infinite';
import styles from './CollaborationListView.css';
import CollaborationListCellView from '../CollaborationListCellView';
import SpinnerView from '../SpinnerView';

class CollaborationListView extends Component {
  static propTypes = {
    onPressRow: PropTypes.func,
    onEndReached: PropTypes.func
  }

  static defaultProps = {
    onPressRow: function() {},
    onEndReached: function() {}
  }

  constructor(props) {
    super(props);
    this._getInitialState = this._getInitialState.bind(this);
    this.buildElements = this.buildElements.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onEndReached = this._onEndReached.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      hasNextPage: false,
      elements: this.buildElements(this.props.collaborations)
    };
  }

  _getUpdatedState(collaborations) {
    return {
      hasNextPage: false,
      elements: this.buildElements(collaborations)
    };
  }

  _onClick(collaboration) {
    this.props.onPressRow(collaboration);
  }

  buildElements(collaborations) {
    return collaborations.edges.map(function (object, index) {
      let collaboration = object.node;
      let collaborationComponent = this.buildElement(collaboration, index);
      return collaborationComponent;
    }.bind(this));
  }

  buildElement(collaboration, index) {
    return (
      <CollaborationListCellView collaboration={collaboration} me={this.props.me} key={index} onClick={this._onClick}></CollaborationListCellView>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collaborations) {
      this.setState(this._getUpdatedState(nextProps.collaborations));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.collaborations.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.collaborations.edges;
    if (edges.length > 0) {
      this.props.onEndReached(edges[edges.length - 1].cursor);
    }
  }

  elementInfiniteLoad() {
      return (
          <SpinnerView />
      );
  }

  render() {
    return (
      <Infinite elementHeight={468}
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
  }
}

export default Relay.createContainer(CollaborationListView, {
  fragments: {
    collaborations: () => Relay.QL`
      fragment on ProjectConnection {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            ${CollaborationListCellView.getFragment('collaboration')},
          }
        }
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${CollaborationListCellView.getFragment('me')},
      }
    `,
  },
});
