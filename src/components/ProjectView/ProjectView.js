'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectView.css';
import { Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ProjectText from '../ProjectText';
import CollaboratorText from '../CollaboratorText';
import CoverImage from '../CoverImage';
import TestCaseView from '../TestCaseView';
import MoreButton from '../MoreButton';

import { registerDidIntroduceTestCase, registerDidUpdateProject, registerDidIntroduceCoverImage, registerDidIntroduceCollaborator } from '../../stores/SubscriptionStore';
import { DidUpdateProjectSubscription, DidIntroduceTestCaseSubscription, DidIntroduceCoverImageSubscription, DidIntroduceCollaboratorSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class ProjectView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushTestCase = this._pushTestCase.bind(this);
    this._pushCoverImage = this._pushCoverImage.bind(this);
    this._pushCollaborator = this._pushCollaborator.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onLoadMoreTestCases = this._onLoadMoreTestCases.bind(this);
  }

  _pushTestCase(testCaseId) {
    let projectId = this.props.project.id;
    this.router.push(`/projects/${projectId}/testCases/${testCaseId}`);
  }

  _pushCoverImage(coverImageId) {
    let projectId = this.props.project.id;
    this.router.push(`/projects/${projectId}/coverImages/${coverImageId}`);
  }

  _pushCollaborator(userId) {
    this.router.push(`/users/${userId}`);
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
    registerDidIntroduceCoverImage({targetId: projectId}, () => {
      return Relay.Store.subscribe(
        new DidIntroduceCoverImageSubscription({target: project})
      );
    });
    registerDidIntroduceCollaborator({projectId}, () => {
      return Relay.Store.subscribe(
        new DidIntroduceCollaboratorSubscription({project})
      );
    });
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

     let collaboratorNodes = this.props.project.collaborators.edges.map(function (object, index) {
       let collaborator = object.node;
           let collaboratorComponent = {
              component: (<CollaboratorText collaborator={collaborator} project={this.props.project} onClick={this._pushCollaborator}/>),
              nodes: []
            };
           return collaboratorComponent;
      }.bind(this));

      object = {
        component: (<ArchyLabel text={'describe:'}/>),
        nodes: [
          {
            component: (<ProjectText project={this.props.project} me={this.props.me} onDelete={this._onDelete}/>),
            nodes: testCaseNodes
          }
        ]
      }

      if (collaboratorNodes.length > 0) {
        object.nodes.push(
          {
            component: (<ArchyLabel text={'in collaboration with'} />),
            nodes: collaboratorNodes
          }
        )
      }

    }

    let coverImage = null;
    if (this.props.project && this.props.project.coverImages && this.props.project.coverImages.edges.length > 0) {
      coverImage = this.props.project.coverImages.edges[0].node;
    }

    return (
      <div className="ProjectView-container">
        <CoverImage coverImage={coverImage} height={400} width={null} target={this.props.project} onClick={this._pushCoverImage}/>
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
        coverImages(last: 1) {
          edges {
            node {
              ${CoverImage.getFragment('coverImage')},
            }
          }
        }
        collaborators(first: 10) {
          edges {
            cursor
            node {
              ${CollaboratorText.getFragment('collaborator')},
            }
          }
        }
        ${CoverImage.getFragment('target')},
        ${ProjectText.getFragment('project')},
        ${TestCaseView.getFragment('project')},
        ${CollaboratorText.getFragment('project')},
        ${DidUpdateProjectSubscription.getFragment('project')},
        ${DidIntroduceTestCaseSubscription.getFragment('project')},
        ${DidIntroduceCoverImageSubscription.getFragment('target')},
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
