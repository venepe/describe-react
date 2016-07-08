'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import Infinite from 'react-infinite';
import styles from './ContactListView.css';
import SpinnerView from '../SpinnerView';
import ContactListToolbar from '../ContactListToolbar';
import ContactListCellView from '../ContactListCellView';
import ContactListPlaceholder from '../ContactListPlaceholder';

const _first = 30;
const _next = 30;

class ContactListView extends Component {
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
      elements: this.buildElements(this.props.me.contacts)
    };
  }

  _getUpdatedState(contacts) {
    return {
      hasNextPage: false,
      elements: this.buildElements(contacts)
    };
  }

  _onClick(contact) {
    let userId = contact.id;
    this.router.push(`/users/${userId}`);
  }

  buildElements(contacts) {
    return contacts.edges.map((object, index) => {
      let contact = object.node;

      return (
        <ContactListCellView key={index} contact={contact} me={this.props.me} onClick={this._onClick} />
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.me) {
      this.setState(this._getUpdatedState(nextProps.me.contacts));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.me.contacts.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.me.contacts.edges;
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
    if (this.props.me.contacts.edges.length > 0) {
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
      return (<ContactListPlaceholder />);
    }
  }
}

export default Relay.createContainer(ContactListView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        id
        contacts (first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${ContactListCellView.getFragment('contact')},
            }
          }
        }
        ${ContactListCellView.getFragment('me')},
      }
    `,
  },
});
