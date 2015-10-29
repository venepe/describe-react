'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectView.css';
import { Paper, Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ModalableArchyLabel from '../ModalableArchyLabel';
import ProjectCoverImage from '../ProjectCoverImage';

import TestCaseFormDialog from '../TestCaseFormDialog';
import PaperFormDialog from '../PaperFormDialog';
import ImageFormDialog from '../ImageFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';
import PaperUpdateFormDialog from '../PaperUpdateFormDialog';

import DeleteTestCaseMutation from '../../mutations/DeleteTestCaseMutation';
import DeleteImageMutation from '../../mutations/DeleteImageMutation';
import DeletePaperMutation from '../../mutations/DeletePaperMutation';
import DeleteProjectMutation from '../../mutations/DeleteProjectMutation';

import EditProjectModal from '../EditProjectModal';
import EditTestCaseModal from '../EditTestCaseModal';
import EditPaperModal from '../EditPaperModal';

import ModalTypes, { INTRODUCE_TEST_CASE, INTRODUCE_PAPER, INTRODUCE_IMAGE, UPDATE_PAPER, UPDATE_PROJECT, UPDATE_TEST_CASE, DELETE_PROJECT } from '../../constants/ModalTypes';

class ProjectView extends Component {
  constructor(props) {
    super(props);
    this._presentDialog = this._presentDialog.bind(this);
  }

  _presentDialog(dialogType, targetId) {
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
        case UPDATE_PROJECT:
            this.refs.projectUpdateFormDialog.show(targetId);
          break;
        case UPDATE_TEST_CASE:
            this.refs.testCaseUpdateFormDialog.show(targetId);
          break;
        case UPDATE_PAPER:
            this.refs.paperUpdateFormDialog.show(targetId);
          break;
      default:

    }
  }

  render() {
    let object = {};
    if (this.props.project) {
      let testCaseNodes = this.props.project.testCases.edges.map(function (object, index) {
        let testCase = object.node;
         let nodes = [
          {
            component: (<ModalableArchyLabel iconMenu={<EditTestCaseModal onItemTouchTap={this._presentDialog} id={testCase.id} />} text={testCase.it}/>),
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
            component: (<ModalableArchyLabel iconMenu={<EditPaperModal onItemTouchTap={this._presentDialog} id={paper.id} />} text={paper.text}/>),
          };
          return paperComponent;
        }.bind(this));

      let imageNodes = this.props.project.images.edges.map(function (object, index) {
         let image = object.node;
          let imageComponent = {
            component: (<img src={image.uri} height={200} width={200} />),
          };
          return imageComponent;
        }.bind(this));

      object = {
        component: (<ArchyLabel text={'describe:'}/>),
        nodes: [
          {
            component: (<ModalableArchyLabel iconMenu={<EditProjectModal onItemTouchTap={this._presentDialog} id={this.props.project.id} />} text={this.props.project.title}/>),
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
