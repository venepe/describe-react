'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectView.css';
import { Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ProjectText from '../ProjectText';
import ExampleImage from '../ExampleImage';
import CoverImage from '../CoverImage';
import TestCaseView from '../TestCaseView';

class ProjectView extends Component {
  constructor(props) {
    super(props);
    this._pushTestCase = this._pushTestCase.bind(this);
    this._pushCoverImage = this._pushCoverImage.bind(this);
    this._pushExample = this._pushExample.bind(this);
    this._onDelete = this._onDelete.bind(this);
  }

  _pushTestCase(testCaseId) {
    let projectId = this.props.project.id;
    this.props.history.pushState(null, `/projects/${projectId}/testCases/${testCaseId}`);
  }

  _pushExample(exampleId) {
    let projectId = this.props.project.id;
    this.props.history.pushState(null, `/projects/${projectId}/examples/${exampleId}`);
  }

  _pushCoverImage(coverImageId) {
    let projectId = this.props.project.id;
    this.props.history.pushState(null, `/projects/${projectId}/coverImages/${coverImageId}`);
  }

  _onDelete() {
    this.props.history.replaceState(null, '/myprojects')
  }

  render() {
    let object = {};
    if (this.props.project) {
      let testCaseNodes = this.props.project.testCases.edges.map(function (object, index) {
        let testCase = object.node;
         let testCaseComponent = {
           component: (<TestCaseView testCase={testCase} project={this.props.project} history={this.props.history} onClick={this._pushTestCase} />),
           nodes: []
         };
         return testCaseComponent;
       }.bind(this));

      let exampleNodes = this.props.project.examples.edges.map(function (object, index) {
         let image = object.node;
          let imageComponent = {
            component: (<ExampleImage example={image} target={this.props.project} onClick={this._pushExample} />),
          };
          return imageComponent;
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

      if (exampleNodes.length > 0) {
        object.nodes[0].nodes.push(
          {
            component: (<ArchyLabel text={'as shown in:'}/>),
            nodes: exampleNodes
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
        <Archy archible={object}/>
      </div>
    );
  }
}

export default Relay.createContainer(ProjectView, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        title
        testCases(first: 10) {
          edges {
            node {
              id
              ${TestCaseView.getFragment('testCase')},
            }
          }
        }
        examples(first: 10) {
          edges {
            node {
              id
              uri
              ${ExampleImage.getFragment('example')},
            }
          }
        }
        coverImages(first: 1) {
          edges {
            node {
              ${CoverImage.getFragment('coverImage')},
            }
          }
        }
        ${CoverImage.getFragment('target')},
        ${ProjectText.getFragment('project')},
        ${ExampleImage.getFragment('target')},
        ${TestCaseView.getFragment('project')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${ProjectText.getFragment('me')},
      }
    `,
  },
});
