'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectView.css';
import { Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import TestCaseLabel from '../TestCaseLabel';
import ProjectText from '../ProjectText';
import TestCaseText from '../TestCaseText';
import ExampleImage from '../ExampleImage';

import ProjectCoverImage from '../ProjectCoverImage';

class ProjectView extends Component {
  constructor(props) {
    super(props);
    this._pushTestCase = this._pushTestCase.bind(this);
    this._pushImage = this._pushImage.bind(this);
    this._onDelete = this._onDelete.bind(this);
  }

  _pushTestCase(testCaseId) {
    let projectId = this.props.project.id;
    this.props.history.pushState(null, `/projects/${projectId}/testCases/${testCaseId}`);
  }

  _pushImage(exampleId) {
    let projectId = this.props.project.id;
    this.props.history.pushState(null, `/target/${projectId}/examples/${exampleId}`);
  }

  _onDelete() {
    this.props.history.replaceState(null, '/myprojects')
  }

  render() {
    let object = {};
    if (this.props.project) {
      let testCaseNodes = this.props.project.testCases.edges.map(function (object, index) {
        let testCase = object.node;
         let nodes = [
          {
            component: (<TestCaseText testCase={testCase} project={this.props.project} onClick={this._pushTestCase}/>),
            nodes: []
          }
         ];
         let testCaseComponent = {
           component: (<TestCaseLabel testCase={testCase} />),
           nodes: nodes
         };
         return testCaseComponent;
       }.bind(this));

      let exampleNodes = this.props.project.examples.edges.map(function (object, index) {
         let image = object.node;
          let imageComponent = {
            component: (<ExampleImage example={image} target={this.props.project} onClick={this._pushImage} />),
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

    return (
      <div className="ProjectView-container">
        <ProjectCoverImage projectCoverImage={this.props.project} isEditable={true} history={this.props.history}/>
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
              ${TestCaseLabel.getFragment('testCase')},
              ${TestCaseText.getFragment('testCase')},
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
        ${ProjectCoverImage.getFragment('projectCoverImage')},
        ${ProjectText.getFragment('project')},
        ${TestCaseText.getFragment('project')},
        ${ExampleImage.getFragment('target')},
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        ${ProjectText.getFragment('me')},
      }
    `,
  },
});
