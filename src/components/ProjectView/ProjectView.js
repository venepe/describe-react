'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectView.css';
import { Paper, Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ModalableArchyLabel from '../ModalableArchyLabel';
import ModalableImage from '../ModalableImage';
import ProjectCoverImage from '../ProjectCoverImage';

import TestCaseFormDialog from '../TestCaseFormDialog';
import PaperFormDialog from '../PaperFormDialog';
import ImageFormDialog from '../ImageFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';
import ProjectFulfillmentFormDialog from '../ProjectFulfillmentFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';
import PaperUpdateFormDialog from '../PaperUpdateFormDialog';

import DeleteTestCaseMutation from '../../mutations/DeleteTestCaseMutation';
import DeleteImageMutation from '../../mutations/DeleteImageMutation';
import DeletePaperMutation from '../../mutations/DeletePaperMutation';
import DeleteProjectMutation from '../../mutations/DeleteProjectMutation';

import EditProjectModal from '../EditProjectModal';
import EditTestCaseModal from '../EditTestCaseModal';
import EditPaperModal from '../EditPaperModal';
import EditImageModal from '../EditImageModal';

import ModalTypes, { INTRODUCE_TEST_CASE, INTRODUCE_PAPER, INTRODUCE_IMAGE, FULFILL_PROJECT, UPDATE_PAPER, UPDATE_PROJECT, UPDATE_TEST_CASE, DELETE_PROJECT, DELETE_TEST_CASE, DELETE_IMAGE, DELETE_PAPER } from '../../constants/ModalTypes';

class ProjectView extends Component {
  constructor(props) {
    super(props);
    this._presentDialog = this._presentDialog.bind(this);
    this._pushTestCase = this._pushTestCase.bind(this);
    this._pushPaper = this._pushPaper.bind(this);
    this._pushImage = this._pushImage.bind(this);
  }

  _presentDialog(dialogType, targetId, targetRelayObject) {
    switch (dialogType) {
      case INTRODUCE_TEST_CASE:
          this.refs.testCaseFormDialog.show(targetId);
        break;
        case INTRODUCE_PAPER:
            this.refs.paperFormDialog.show(targetId);
          break;
        case INTRODUCE_IMAGE:
            this.refs.imageFormDialog.show(targetId);
          break;
        case FULFILL_PROJECT:
            this.refs.projectFulfillmentFormDialog.show(targetId);
          break;
        case UPDATE_PROJECT:
            this.refs.projectUpdateFormDialog.show(targetId);
          break;
        case UPDATE_TEST_CASE:
            this.refs.testCaseUpdateFormDialog.show(targetId);
          break;
        case UPDATE_PAPER:
            this.refs.paperUpdateFormDialog.show(targetId);
          break;
        case DELETE_PROJECT:
            Relay.Store.update(
              new DeleteProjectMutation({project: targetRelayObject, me: {id: null}})
            );
          break;
        case DELETE_TEST_CASE:
            Relay.Store.update(
              new DeleteTestCaseMutation({testCase: targetRelayObject, project: this.props.project})
            );
          break;
        case DELETE_IMAGE:
            Relay.Store.update(
              new DeleteImageMutation({image: targetRelayObject, target: this.props.project})
            );
          break;
        case DELETE_PAPER:
            Relay.Store.update(
              new DeletePaperMutation({paper: targetRelayObject, target: this.props.project})
            );
          break;
      default:

    }
  }

  _pushTestCase(id) {
    this.props.history.pushState(null, '/testCases/' + id);
  }

  _pushPaper(id) {
    this.props.history.pushState(null, '/papers/' + id);
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
           component: (<ArchyLabel text={'it should:'} />),
           nodes: nodes
         };
         return testCaseComponent;
       }.bind(this));

       let paperNodes = this.props.project.papers.edges.map(function (object, index) {
         let paper = object.node;

          let paperComponent = {
            component: (<ModalableArchyLabel iconMenu={<EditPaperModal onItemTouchTap={this._presentDialog} id={paper.id} paper={paper} />} id={paper.id} text={paper.text} onClick={this._pushPaper} />),
          };
          return paperComponent;
        }.bind(this));

      let imageNodes = this.props.project.images.edges.map(function (object, index) {
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

      if (paperNodes.length > 0) {
        object.nodes[0].nodes.push(
          {
            component: (<ArchyLabel text={'as described below:'} />),
            nodes: paperNodes
          },
        )
      }

      if (imageNodes.length > 0) {
        object.nodes[0].nodes.push(
          {
            component: (<ArchyLabel text={'as shown in:'}/>),
            nodes: imageNodes
          }
        )
      }
    }

    return (
      <div className="ProjectView-container">
        <ProjectCoverImage projectCoverImage={this.props.project} />
        <Archy archible={object}/>
          <ProjectUpdateFormDialog ref="projectUpdateFormDialog" />
          <TestCaseFormDialog ref="testCaseFormDialog" />
          <PaperFormDialog ref="paperFormDialog" />
          <ImageFormDialog ref="imageFormDialog" />
          <TestCaseUpdateFormDialog ref="testCaseUpdateFormDialog" />
          <PaperUpdateFormDialog ref="paperUpdateFormDialog" />
          <ProjectFulfillmentFormDialog ref="projectFulfillmentFormDialog" />
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
              ${DeleteTestCaseMutation.getFragment('testCase')},
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              uri
              ${DeleteImageMutation.getFragment('image')},
            }
          }
        }
        papers(first: 10) {
          edges {
            node {
              id
              text
              ${DeletePaperMutation.getFragment('paper')},
            }
          }
        }
        ${ProjectCoverImage.getFragment('projectCoverImage')},
        ${DeleteTestCaseMutation.getFragment('project')},
        ${DeleteImageMutation.getFragment('target')},
        ${DeletePaperMutation.getFragment('target')},
        ${DeleteProjectMutation.getFragment('project')},
      }
    `,
  },
});
