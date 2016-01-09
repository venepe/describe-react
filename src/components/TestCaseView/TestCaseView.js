'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseView.css';
import { Paper, Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import TestCaseLabel from '../TestCaseLabel';
import TestCaseText from '../TestCaseText';
import ExampleImage from '../ExampleImage';
import FulfillmentImage from '../FulfillmentImage';

class TestCaseView extends Component {
  constructor(props) {
    super(props);
    this._pushExample = this._pushExample.bind(this);
    this._pushFulfillment = this._pushFulfillment.bind(this);
  }

  _pushExample(exampleId) {
    let projectId = this.props.project.id;
    let testCaseId = this.props.testCase.id;
    this.props.history.pushState(null, `/projects/${projectId}/testCases/${testCaseId}/examples/${exampleId}`);
  }

  _pushFulfillment(fulfillmentId) {
    let projectId = this.props.project.id;
    let testCaseId = this.props.testCase.id;
    this.props.history.pushState(null, `/projects/${projectId}/testCases/${testCaseId}/fulfillments/${fulfillmentId}`);
  }

  render() {
    let object = {};
    if (this.props.testCase) {
      let testCase = this.props.testCase;
      let exampleNodes = [];
      let fulfillmentNodes = [];

      if (testCase.examples) {
        exampleNodes = testCase.examples.edges.map(function (object, index) {
           let image = object.node;
            let imageComponent = {
              component: (<ExampleImage example={image} target={this.props.testCase} onClick={this._pushExample} />),
            };
            return imageComponent;
          }.bind(this));
      }

      if (testCase.fulfillments) {
        fulfillmentNodes = testCase.fulfillments.edges.map(function (object, index) {
          let image = object.node;
           let imageComponent = {
             component: (<FulfillmentImage fulfillment={image} testCase={this.props.testCase} project={this.props.project} onClick={this._pushFulfillment} />),
           };
           return imageComponent;
        }.bind(this));
      }

      object = {
        component: (<TestCaseLabel testCase={this.props.testCase} />),
        nodes: [
          {
            component: (<TestCaseText testCase={this.props.testCase} project={this.props.project} onClick={this.props.onClick} onDelete={this.props.onDelete}/>),
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
      </div>
    );
  }
}

TestCaseView.propTypes = {onClick: PropTypes.func, onDelete: PropTypes.func};
TestCaseView.defaultProps = {history: {}, onClick: function() {}, onDelete: function() {}};

export default Relay.createContainer(TestCaseView, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        it
        examples(first: 10) {
          edges {
            node {
              id
              uri
              ${ExampleImage.getFragment('example')},
            }
          }
        }
        fulfillments(first: 10) {
          edges {
            node {
              id
              uri
              ${FulfillmentImage.getFragment('fulfillment')},
            }
          }
        }
        ${ExampleImage.getFragment('target')},
        ${TestCaseText.getFragment('testCase')},
        ${TestCaseLabel.getFragment('testCase')},
        ${FulfillmentImage.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        ${TestCaseText.getFragment('project')},
        ${FulfillmentImage.getFragment('project')},
      }
    `,
  },
});
