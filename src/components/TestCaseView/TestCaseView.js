'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseView.css';
import { Paper, Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ModalableArchyLabel from '../ModalableArchyLabel';
import ModalableImage from '../ModalableImage';

import ImageFormDialog from '../ImageFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';
import ProjectFulfillmentFormDialog from '../ProjectFulfillmentFormDialog';

import DeleteTestCaseMutation from '../../mutations/DeleteTestCaseMutation';
import DeleteImageMutation from '../../mutations/DeleteImageMutation';
import DeleteProjectMutation from '../../mutations/DeleteProjectMutation';

import EditTestCaseModal from '../EditTestCaseModal';
import EditImageModal from '../EditImageModal';
import EditProjectModal from '../EditProjectModal';

import ModalTypes, { INTRODUCE_IMAGE, FULFILL_PROJECT, UPDATE_PROJECT, UPDATE_TEST_CASE, DELETE_TEST_CASE, DELETE_IMAGE, DELETE_PROJECT } from '../../constants/ModalTypes';

class TestCaseView extends Component {
  constructor(props) {
    super(props);
    this._presentDialog = this._presentDialog.bind(this);
    this._pushProject = this._pushProject.bind(this);
    this._pushImage = this._pushImage.bind(this);
  }

  _presentDialog(dialogType, targetId, targetRelayObject) {
    switch (dialogType) {
        case INTRODUCE_IMAGE:
            this.refs.imageFormDialog.show(targetId);
          break;
        case FULFILL_PROJECT:
            this.refs.projectFulfillmentFormDialog.show(targetId);
          break;
        case UPDATE_TEST_CASE:
            this.refs.testCaseUpdateFormDialog.show(targetId);
          break;
        case UPDATE_PROJECT:
            this.refs.projectUpdateFormDialog.show(targetId);
          break;
        case DELETE_TEST_CASE:
            Relay.Store.update(
              new DeleteTestCaseMutation({testCase, project: {id: null}})
            );
          break;
        case DELETE_IMAGE:
            Relay.Store.update(
              new DeleteImageMutation({image: targetRelayObject, target: this.props.testCase})
            );
          break;
        case DELETE_PROJECT:
            Relay.Store.update(
              new DeleteProjectMutation({project: targetRelayObject, me: {id: null}})
            );
          break;

      default:

    }
  }

  _pushProject(id) {
    this.props.history.pushState(null, '/projects/' + id);
  }

  _pushImage(id) {
    this.props.history.pushState(null, '/images/' + id);
  }

  render() {
    let object = {};
    if (this.props.testCase) {

      let imageNodes = this.props.testCase.images.edges.map(function (object, index) {
         let image = object.node;
          let imageComponent = {
            component: (<ModalableImage iconMenu={<EditImageModal onItemTouchTap={this._presentDialog} id={image.id} image={image} />} id={image.id} src={image.uri} onClick={this._pushImage} />),
          };
          return imageComponent;
        }.bind(this));

      let fulfillmentNodes = this.props.testCase.fulfillments.edges.map(function (object, index) {
       var project = object.node;
        var projectComponent = {
          component: (<ArchyLabel text={'describe:'}/>),
          nodes: [
            {
              component: (<ModalableArchyLabel iconMenu={<EditProjectModal onItemTouchTap={this._presentDialog} id={project.id} project={project} />} id={project.id} text={project.title} onClick={this._pushProject} />),
            }
          ]
        };
        return projectComponent;
      }.bind(this));

      object = {
        component: (<ArchyLabel text={'it should:'}/>),
        nodes: [
          {
            component: (<ModalableArchyLabel iconMenu={<EditTestCaseModal onItemTouchTap={this._presentDialog} id={this.props.testCase.id} testCase={this.props.testCase} />} text={this.props.testCase.it}/>),
            nodes: []
          }
        ]
      }

      if (imageNodes.length > 0) {
        object.nodes[0].nodes.push(
          {
            component: (<ArchyLabel text={'as shown in:'}/>),
            nodes: imageNodes
          }
        )
      }

      if (fulfillmentNodes.length > 0) {
        object.nodes[0].nodes.push(
          {
            component: (<ArchyLabel text={'as fulfilled by'} />),
            nodes: fulfillmentNodes
          }
        )
      }
    }

    return (
      <div className="TestCaseView-container">
        <Archy archible={object}/>
          <ProjectUpdateFormDialog ref="projectUpdateFormDialog" />
          <ImageFormDialog ref="imageFormDialog" />
          <TestCaseUpdateFormDialog ref="testCaseUpdateFormDialog" />
          <ProjectFulfillmentFormDialog ref="projectFulfillmentFormDialog" />
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseView, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        it
        images(first: 10) {
          edges {
            node {
              id
              uri
              ${DeleteImageMutation.getFragment('image')},
            }
          }
        }
        fulfillments(first: 10) {
          edges {
            node {
              id
              title
              ${DeleteProjectMutation.getFragment('project')},
            }
          }
        }
        ${DeleteImageMutation.getFragment('target')},
        ${DeleteTestCaseMutation.getFragment('testCase')},
      }
    `,
  },
});
