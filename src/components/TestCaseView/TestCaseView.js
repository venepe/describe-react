'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseView.css';
import { Paper, Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import TestCaseLabel from '../TestCaseLabel';
import ModalableArchyLabel from '../ModalableArchyLabel';
import ModalableImage from '../ModalableImage';

import ImageFormDialog from '../ImageFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';
import ProjectUpdateFormDialog from '../ProjectUpdateFormDialog';
import ImageFulfillmentFormDialog from '../ImageFulfillmentFormDialog';

import DeleteTestCaseMutation from '../../mutations/DeleteTestCaseMutation';
import DeleteExampleMutation from '../../mutations/DeleteExampleMutation';
import DeleteFulfillmentMutation from '../../mutations/DeleteFulfillmentMutation';
import DeleteProjectMutation from '../../mutations/DeleteProjectMutation';

import EditTestCaseModal from '../EditTestCaseModal';
import EditImageModal from '../EditImageModal';
import EditProjectModal from '../EditProjectModal';
import EditFulfillmentModal from '../EditFulfillmentModal';

import ModalTypes, { INTRODUCE_EXAMPLE, FULFILL_IMAGE, UPDATE_PROJECT, UPDATE_TEST_CASE, DELETE_TEST_CASE, DELETE_EXAMPLE, DELETE_FULFILLMENT, DELETE_PROJECT } from '../../constants/ModalTypes';

class TestCaseView extends Component {
  constructor(props) {
    super(props);
    this._presentDialog = this._presentDialog.bind(this);
    this._pushProject = this._pushProject.bind(this);
    this._pushImage = this._pushImage.bind(this);
  }

  _presentDialog(dialogType, targetId, targetRelayObject) {
    switch (dialogType) {
        case INTRODUCE_EXAMPLE:
            this.refs.imageFormDialog.show(targetId);
          break;
        case FULFILL_IMAGE:
            this.refs.imageFulfillmentFormDialog.show(targetId);
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
        case DELETE_EXAMPLE:
            Relay.Store.update(
              new DeleteExampleMutation({example: targetRelayObject, target: this.props.testCase})
            );
          break;
        case DELETE_FULFILLMENT:
            Relay.Store.update(
              new DeleteFulfillmentMutation({fulfillment: targetRelayObject, testCase: this.props.testCase})
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

      let exampleNodes = this.props.testCase.examples.edges.map(function (object, index) {
         let image = object.node;
          let imageComponent = {
            component: (<ModalableImage iconMenu={<EditImageModal onItemTouchTap={this._presentDialog} id={image.id} image={image} />} id={image.id} src={image.uri} onClick={this._pushImage} />),
          };
          return imageComponent;
        }.bind(this));

      let fulfillmentNodes = this.props.testCase.fulfillments.edges.map(function (object, index) {
        let image = object.node;
         let imageComponent = {
           component: (<ModalableImage iconMenu={<EditFulfillmentModal onItemTouchTap={this._presentDialog} id={image.id} image={image} />} id={image.id} src={image.uri} onClick={this._pushImage} />),
         };
         return imageComponent;
      }.bind(this));

      object = {
        component: (<TestCaseLabel isFulfilled={this.props.testCase.isFulfilled} />),
        nodes: [
          {
            component: (<ModalableArchyLabel iconMenu={<EditTestCaseModal onItemTouchTap={this._presentDialog} id={this.props.testCase.id} testCase={this.props.testCase} />} text={this.props.testCase.it}/>),
            nodes: []
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

      if (fulfillmentNodes.length > 0) {
        object.nodes[0].nodes.push(
          {
            component: (<ArchyLabel text={'as fulfilled in:'} />),
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
          <ImageFulfillmentFormDialog ref="imageFulfillmentFormDialog" />
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
        isFulfilled
        examples(first: 10) {
          edges {
            node {
              id
              uri
              ${DeleteExampleMutation.getFragment('example')},
            }
          }
        }
        fulfillments(first: 10) {
          edges {
            node {
              id
              uri
              ${DeleteFulfillmentMutation.getFragment('fulfillment')},
            }
          }
        }
        ${DeleteExampleMutation.getFragment('target')},
        ${DeleteTestCaseMutation.getFragment('testCase')},
        ${DeleteFulfillmentMutation.getFragment('testCase')},
      }
    `,
  },
});
