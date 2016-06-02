'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import Infinite from 'react-infinite';
import styles from './TestCaseEventListView.css';
import DiffLabel from '../DiffLabel';
import SpinnerView from '../SpinnerView';
import { Card } from 'material-ui';
import moment from 'moment';

const _first = 10;
const _next = 10;

class TestCaseEventListView extends Component {
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
    this._onEndReached = this._onEndReached.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      hasNextPage: false,
      elements: this.buildElements(this.props.testCase.events)
    };
  }

  _getUpdatedState(events) {
    return {
      hasNextPage: false,
      elements: this.buildElements(events)
    };
  }

  buildElements(events) {
    return events.edges.map((object, index) => {
      let current = object.node.text;
      let previous = (index === 0) ? current : events.edges[index - 1].node.text;
      let author = object.node.author;
      return (
        <Card key={index} className="event-row">
          <DiffLabel previous={previous} current={current}></DiffLabel>
          <div className="sub-container">
            <div className="author">{author.name}</div>
            <div className="date-created">{moment(object.node.createdAt).format('MMM DD, YYYY hh:mm A')}</div>
          </div>
        </Card>
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testCase) {
      this.setState(this._getUpdatedState(nextProps.testCase.events));
    }
  }

  _onEndReached() {
    let hasNextPage = this.props.testCase.events.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.testCase.events.edges;
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
  }
}

export default Relay.createContainer(TestCaseEventListView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        events (first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              text
              createdAt
              author {
                id
                name
              }
            }
          }
        }
        moreEvents: events(first: $moreFirst, after: $after) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              text
              createdAt
              author {
                id
                name
              }
            }
          }
        }
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  },
});
