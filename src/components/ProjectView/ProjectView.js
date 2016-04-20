'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectView.css';
import { Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ProjectText from '../ProjectText';
import TestCaseView from '../TestCaseView';
import MoreButton from '../MoreButton';

import { registerDidIntroduceTestCase, registerDidUpdateProject, registerDidIntroduceCollaborator } from '../../stores/SubscriptionStore';
import { DidUpdateProjectSubscription, DidIntroduceTestCaseSubscription, DidIntroduceCollaboratorSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class ProjectView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushProjectEvents = this._pushProjectEvents.bind(this);
    this._pushTestCase = this._pushTestCase.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onLoadMoreTestCases = this._onLoadMoreTestCases.bind(this);
  }

  _pushProjectEvents() {
    let projectId = this.props.project.id;
    this.router.push(`/projects/${projectId}/events`);
  }

  _pushTestCase(testCaseId) {
    let projectId = this.props.project.id;
    this.router.push(`/projects/${projectId}/testCases/${testCaseId}`);
  }

  _onDelete() {
    this.router.replace('/myprojects');
  }

  _onLoadMoreTestCases() {
    var first = this.props.relay.variables.first;
    var edges = this.props.project.originalTestCases.edges;
    var cursor = edges[edges.length - 1].cursor;
    this.props.relay.setVariables({
      first: first + _next,
      after: cursor
    });
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
      registerDidIntroduceCollaborator({projectId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceCollaboratorSubscription({project})
        );
      });
    }
  }

  render() {
    let object = {};
    if (this.props.project) {
      let hasNextPage = this.props.project.originalTestCases.pageInfo.hasNextPage;
      let testCaseNodes = this.props.project.originalTestCases.edges.map(function (object, index) {
        let testCase = object.node;
         let testCaseComponent = {
           component: (<TestCaseView testCase={testCase} project={this.props.project} onClick={this._pushTestCase} />),
           nodes: []
         };
         return testCaseComponent;
       }.bind(this));

       if (hasNextPage) {
           let moreComponent = {
             component: (<MoreButton onClick={this._onLoadMoreTestCases} />),
             nodes: []
           };
           testCaseNodes.push(moreComponent);
         }

      object = {
        component: (<ArchyLabel text={'describe:'}/>),
        nodes: [
          {
            component: (<ProjectText project={this.props.project} me={this.props.me} onClick={this._pushProjectEvents} onDelete={this._onDelete}/>),
            nodes: testCaseNodes
          }
        ]
      }

    }

    let coverImage = null;
    if (this.props.project && this.props.project.coverImages && this.props.project.coverImages.edges.length > 0) {
      coverImage = this.props.project.coverImages.edges[0].node;
    }

    return (
      <div className="ProjectView-container">
        <div className="ProjectArchy-container">
          <Archy archible={object}/>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(ProjectView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        title
        originalTestCases: testCases(first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              ${TestCaseView.getFragment('testCase')},
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
              id
              ${TestCaseView.getFragment('testCase')},
            }
          }
        }
        ${ProjectText.getFragment('project')},
        ${TestCaseView.getFragment('project')},
        ${DidUpdateProjectSubscription.getFragment('project')},
        ${DidIntroduceTestCaseSubscription.getFragment('project')},
        ${DidIntroduceCollaboratorSubscription.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id,
        ${ProjectText.getFragment('me')},
      }
    `,
  },
});
