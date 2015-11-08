'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectView.css';
import { Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import TestCaseLabel from '../TestCaseLabel';
import ModalableArchyLabel from '../ModalableArchyLabel';
import ModalableImage from '../ModalableImage';
import ProjectCoverImage from '../ProjectCoverImage';

import TestCaseFormDialog from '../TestCaseFormDialog';
import ImageFormDialog from '../ImageFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';
import ImageFulfillmentFormDialog from '../ImageFulfillmentFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';

import DeleteTestCaseMutation from '../../mutations/DeleteTestCaseMutation';
import DeleteExampleMutation from '../../mutations/DeleteExampleMutation';
import DeleteProjectMutation from '../../mutations/DeleteProjectMutation';

import EditProjectModal from '../EditProjectModal';
import EditTestCaseModal from '../EditTestCaseModal';
import EditImageModal from '../EditImageModal';

import ModalTypes, { INTRODUCE_TEST_CASE, INTRODUCE_EXAMPLE, FULFILL_IMAGE, UPDATE_PROJECT, UPDATE_TEST_CASE, DELETE_PROJECT, DELETE_TEST_CASE, DELETE_EXAMPLE } from '../../constants/ModalTypes';

class ProjectView extends Component {
  constructor(props) {
    super(props);
    this._presentDialog = this._presentDialog.bind(this);
    this._pushTestCase = this._pushTestCase.bind(this);
    this._pushImage = this._pushImage.bind(this);
  }

  _presentDialog(dialogType, targetId, targetRelayObject) {
    switch (dialogType) {
      case INTRODUCE_TEST_CASE:
          this.refs.testCaseFormDialog.show(targetId);
        break;
        case INTRODUCE_EXAMPLE:
            this.refs.imageFormDialog.show(targetId);
          break;
        case FULFILL_IMAGE:
            this.refs.imageFulfillmentFormDialog.show(targetId);
          break;
        case UPDATE_PROJECT:
            this.refs.projectUpdateFormDialog.show(targetId);
          break;
        case UPDATE_TEST_CASE:
            this.refs.testCaseUpdateFormDialog.show(targetId);
          break;
        case DELETE_PROJECT:
            Relay.Store.update(
              new DeleteProjectMutation({project: targetRelayObject, me: {id: null}})
            );
            this.props.history.replaceState(null, '/myprojects')
          break;
        case DELETE_TEST_CASE:
            Relay.Store.update(
              new DeleteTestCaseMutation({testCase: targetRelayObject, project: this.props.project})
            );
          break;
        case DELETE_EXAMPLE:
            Relay.Store.update(
              new DeleteExampleMutation({example: targetRelayObject, target: this.props.project})
            );
          break;
      default:

    }
  }

  _pushTestCase(id) {
    this.props.history.pushState(null, '/testCases/' + id);
  }

  _pushImage(id) {
    this.props.history.pushState(null, '/images/' + id);
  }

  render() {
    let object = {};
    if (this.props.project) {
      let testCaseNodes = this.props.project.testCases.edges.map(function (object, index) {
        let testCase = object.node;
         let nodes = [
          {
            component: (<ModalableArchyLabel iconMenu={<EditTestCaseModal onItemTouchTap={this._presentDialog} id={testCase.id} testCase={testCase} />} id={testCase.id} text={testCase.it} onClick={this._pushTestCase} />),
            nodes: []
          }
         ];
         let testCaseComponent = {
           component: (<TestCaseLabel isFulfilled={testCase.isFulfilled} />),
           nodes: nodes
         };
         return testCaseComponent;
       }.bind(this));

      let exampleNodes = this.props.project.examples.edges.map(function (object, index) {
         let image = object.node;
          let imageComponent = {
            component: (<ModalableImage iconMenu={<EditImageModal onItemTouchTap={this._presentDialog} id={image.id} image={image} />} id={image.id} src={image.uri} onClick={this._pushImage} />),
          };
          return imageComponent;
        }.bind(this));

      object = {
        component: (<ArchyLabel text={'describe:'}/>),
        nodes: [
          {
            component: (<ModalableArchyLabel iconMenu={<EditProjectModal onItemTouchTap={this._presentDialog} id={this.props.project.id} project={this.props.project} />} text={this.props.project.title}/>),
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
          <ProjectUpdateFormDialog ref="projectUpdateFormDialog" />
          <TestCaseFormDialog ref="testCaseFormDialog" />
          <ImageFormDialog ref="imageFormDialog" />
          <TestCaseUpdateFormDialog ref="testCaseUpdateFormDialog" />
          <ImageFulfillmentFormDialog ref="imageFulfillmentFormDialog" />
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
              it
              isFulfilled
              ${DeleteTestCaseMutation.getFragment('testCase')},
            }
          }
        }
        examples(first: 10) {
          edges {
            node {
              id
              uri
              ${DeleteExampleMutation.getFragment('example')},
            }
          }
        }
        ${ProjectCoverImage.getFragment('projectCoverImage')},
        ${DeleteTestCaseMutation.getFragment('project')},
        ${DeleteExampleMutation.getFragment('target')},
        ${DeleteProjectMutation.getFragment('project')},
      }
    `,
  },
});
