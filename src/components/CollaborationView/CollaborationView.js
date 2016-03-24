'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CollaborationView.css';
import { Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import CollaborationText from '../CollaborationText';
import CollaboratorText from '../CollaboratorText';
import TouchableArchyLabel from '../TouchableArchyLabel';
import CoverImage from '../CoverImage';
import TestCaseView from '../TestCaseView';
import MoreButton from '../MoreButton';

import { registerDidIntroduceTestCase, registerDidUpdateProject, registerDidIntroduceCoverImage, registerDidIntroduceCollaborator } from '../../stores/SubscriptionStore';
import { DidUpdateProjectSubscription, DidIntroduceTestCaseSubscription, DidIntroduceCoverImageSubscription, DidIntroduceCollaboratorSubscription } from '../../subscriptions';

const _first = 10;
const _next = 10;

class CollaborationView extends Component {
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
    let collaborationId = this.props.collaboration.id;
    this.router.push(`/collaborations/${collaborationId}/testCases/${testCaseId}`);
  }

  _pushCoverImage(coverImageId) {
    let collaborationId = this.props.collaboration.id;
    this.router.push(`/collaborations/${collaborationId}/coverImages/${coverImageId}`);
  }

  _pushCollaborator(userId) {
    this.router.push(`/users/${userId}`);
  }

  _onDelete() {
    this.router.replace('/mycollaborations');
  }

  _onLoadMoreTestCases() {
    var first = this.props.relay.variables.first;
    var edges = this.props.collaboration.originalTestCases.edges;
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
    let project = this.props.collaboration;
    registerDidUpdateProject({project}, () => {
      return Relay.Store.subscribe(
        new DidUpdateProjectSubscription({project})
      );
    });
    registerDidIntroduceTestCase({project}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceTestCaseSubscription({project})
        );
    });
    registerDidIntroduceCoverImage({target: project}, () => {
      return Relay.Store.subscribe(
        new DidIntroduceCoverImageSubscription({target: project})
      );
    });
    registerDidIntroduceCollaborator({project}, () => {
      return Relay.Store.subscribe(
        new DidIntroduceCollaboratorSubscription({project})
      );
    });
  }

  render() {
    let object = {};
    if (this.props.collaboration) {
      let hasNextPage = this.props.collaboration.originalTestCases.pageInfo.hasNextPage;
      let testCaseNodes = this.props.collaboration.originalTestCases.edges.map(function (object, index) {
        let testCase = object.node;
         let testCaseComponent = {
           component: (<TestCaseView testCase={testCase} project={this.props.collaboration} onClick={this._pushTestCase} />),
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

     let leaderNodes = this.props.collaboration.leaders.edges.map(function (object, index) {
       let leader = object.node;
           let leaderComponent = {
              component: (<TouchableArchyLabel id={leader.id} text={leader.name} onClick={this._pushCollaborator}/>),
              nodes: []
            };
           return leaderComponent;
      }.bind(this));

     let collaboratorNodes = this.props.collaboration.collaborators.edges.map(function (object, index) {
       let collaborator = object.node;
           let collaboratorComponent = {
              component: (<CollaboratorText collaborator={collaborator} project={this.props.collaboration} onClick={this._pushCollaborator}/>),
              nodes: []
            };
           return collaboratorComponent;
      }.bind(this));

      object = {
        component: (<ArchyLabel text={'describe:'}/>),
        nodes: [
          {
            component: (<CollaborationText collaboration={this.props.collaboration} me={this.props.me} onDelete={this._onDelete}/>),
            nodes: testCaseNodes
          }
        ]
      }

      if (leaderNodes.length > 0) {
        object.nodes.push(
          {
            component: (<ArchyLabel text={'led by'} />),
            nodes: leaderNodes
          }
        )
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
    if (this.props.collaboration && this.props.collaboration.coverImages && this.props.collaboration.coverImages.edges.length > 0) {
      coverImage = this.props.collaboration.coverImages.edges[0].node;
    }

    return (
      <div className="CollaborationView-container">
        <CoverImage coverImage={coverImage} height={400} width={null} target={this.props.collaboration} onClick={this._pushCoverImage}/>
        <div className="CollaborationArchy-container">
          <Archy archible={object}/>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(CollaborationView, {
  initialVariables: {
    first: _first,
    after: null,
    moreFirst: _first
  },
  fragments: {
    collaboration: () => Relay.QL`
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
        leaders(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
        ${CoverImage.getFragment('target')},
        ${CollaborationText.getFragment('collaboration')},
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
        id
        ${CollaborationText.getFragment('me')},
      }
    `,
  },
});
