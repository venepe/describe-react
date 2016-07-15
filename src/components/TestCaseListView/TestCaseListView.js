'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import Infinite from 'react-infinite';
import styles from './TestCaseListView.css';
import { Dialog } from 'material-ui';
import TestCaseListCell from '../TestCaseListCell';
import TestCasePlaceholder from '../TestCasePlaceholder';
import SpinnerView from '../SpinnerView';

import { registerDidIntroduceTestCase, registerDidUpdateProject } from '../../stores/SubscriptionStore';
import { DidUpdateProjectSubscription, DidIntroduceTestCaseSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class TestCaseListView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._getInitialState = this._getInitialState.bind(this);
    this.buildElements = this.buildElements.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._pushTestCase = this._pushTestCase.bind(this);

    //
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      hasNextPage: false,
      elements: this.buildElements(this.props.project.testCases)
    };
  }

  _getUpdatedState(testCases) {
    return {
      hasNextPage: false,
      elements: this.buildElements(testCases)
    };
  }

  _pushTestCase({testCaseId}) {
    let projectId = this.props.project.id;
    this.router.push(`/projects/${projectId}/testCases/${testCaseId}`);
  }

  buildElements(testCases) {
    return testCases.edges.map((object, index) => {
      let testCase = object.node;

      return (
        <TestCaseListCell key={index} project={this.props.project} testCase={testCase} onClick={this._pushTestCase} />
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project) {
      this.setState(this._getUpdatedState(nextProps.project.testCases));
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.project) {
      let project = this.props.project;
      let projectId = project.id;

      registerDidUpdateProject({projectId}, () => {
        return Relay.Store.subscribe(
          new DidUpdateProjectSubscription({project})
        );
      });
      registerDidIntroduceTestCase({projectId}, () => {
          return Relay.Store.subscribe(
            new DidIntroduceTestCaseSubscription({project})
          );
      });
    }
  }


  _onEndReached() {
    let hasNextPage = this.props.project.testCases.pageInfo.hasNextPage;
    this.setState({hasNextPage});
    let edges = this.props.project.testCases.edges;
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
    if (this.props.project.testCases.edges.length > 0) {
      return (
          <Infinite elementHeight={400}
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
      return (<TestCasePlaceholder />);
    }
  }
}

export default Relay.createContainer(TestCaseListView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        text
        testCases(first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              status
              ${TestCaseListCell.getFragment('testCase')},
            }
          }
        }
        moreTestCases: testCases(first: $moreFirst, after: $after) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${TestCaseListCell.getFragment('testCase')},
            }
          }
        }
        ${TestCaseListCell.getFragment('project')},
        ${DidUpdateProjectSubscription.getFragment('project')},
        ${DidIntroduceTestCaseSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
});
