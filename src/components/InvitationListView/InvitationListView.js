'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Infinite from 'react-infinite';
import styles from './InvitationListView.css';
import InvitationListCellView from '../InvitationListCellView';
import SpinnerView from '../SpinnerView';

class InvitationListView extends Component {
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
      elements: this.buildElements(this.props.invitations)
    };
  }

  _getUpdatedState(invitations) {
    return {
      hasNextPage: false,
      elements: this.buildElements(invitations)
    };
  }

  _onClick(invitation) {
    this.props.onPressRow(invitation);
  }

  buildElements(invitations) {
    return invitations.edges.map(function (object, index) {
      let invitation = object.node;
      let invitationComponent = this.buildElement(invitation, index);
      return invitationComponent;
    }.bind(this));
  }

  buildElement(invitation, index) {
    return (
      <InvitationListCellView invitation={invitation} me={this.props.me} key={index} onClick={this._onClick}></InvitationListCellView>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitations) {
      this.setState(this._getUpdatedState(nextProps.invitations));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.invitations.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.invitations.edges;
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
      <Infinite elementHeight={84}
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

export default Relay.createContainer(InvitationListView, {
  fragments: {
    invitations: () => Relay.QL`
      fragment on InvitationConnection {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            ${InvitationListCellView.getFragment('invitation')},
          }
        }
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${InvitationListCellView.getFragment('me')},
      }
    `,
  },
});
