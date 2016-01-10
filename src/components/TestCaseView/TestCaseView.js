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
import MoreButton from '../MoreButton';

const _first = 2;
const _next = 2;

class TestCaseView extends Component {
  constructor(props) {
    super(props);
    this._pushExample = this._pushExample.bind(this);
    this._pushFulfillment = this._pushFulfillment.bind(this);
    this._onLoadMoreExamples = this._onLoadMoreExamples.bind(this);
    this._onLoadMoreFulfillments = this._onLoadMoreFulfillments.bind(this);
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

  _onLoadMoreExamples() {
    var first = this.props.relay.variables.firstExample;
    var edges = this.props.testCase.originalExamples.edges;
    var cursor = edges[edges.length - 1].cursor;
    this.props.relay.setVariables({
      firstExample: first + _next,
      afterExample: cursor
    });
  }

  _onLoadMoreFulfillments() {
    var first = this.props.relay.variables.firstFulfillment;
    var edges = this.props.testCase.originalFulfillments.edges;
    var cursor = edges[edges.length - 1].cursor;
    this.props.relay.setVariables({
      firstFulfillment: first + _next,
      afterFulfillment: cursor
    });
  }

  render() {
    let object = {};
    if (this.props.testCase) {
      let testCase = this.props.testCase;
      let exampleNodes = [];
      let fulfillmentNodes = [];

      if (testCase.originalExamples) {
        let hasNextPage = testCase.originalExamples.pageInfo.hasNextPage;
        exampleNodes = testCase.originalExamples.edges.map(function (object, index) {
           let image = object.node;
            let imageComponent = {
              component: (<ExampleImage example={image} target={this.props.testCase} onClick={this._pushExample} />),
            };
            return imageComponent;
          }.bind(this));

          if (hasNextPage) {
             let moreComponent = {
               component: (<MoreButton onClick={this._onLoadMoreExamples} />),
               nodes: []
             };
             exampleNodes.push(moreComponent);
           }
      }

      if (testCase.originalFulfillments) {
        let hasNextPage = testCase.originalFulfillments.pageInfo.hasNextPage;
        fulfillmentNodes = testCase.originalFulfillments.edges.map(function (object, index) {
          let image = object.node;
           let imageComponent = {
             component: (<FulfillmentImage fulfillment={image} testCase={this.props.testCase} project={this.props.project} onClick={this._pushFulfillment} />),
           };
           return imageComponent;
        }.bind(this));

        if (hasNextPage) {
           let moreComponent = {
             component: (<MoreButton onClick={this._onLoadMoreFulfillments} />),
             nodes: []
           };
           fulfillmentNodes.push(moreComponent);
         }
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
  initialVariables: {
    firstExample: _first,
    afterExample: null,
    moreFirstExample: _first,
    firstFulfillment: _first,
    afterFulfillment: null,
    moreFirstFulfillment: _first
  },
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        it
        originalExamples: examples(first: $firstExample) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${ExampleImage.getFragment('example')},
            }
          }
        }
        moreExamples: examples(first: $moreFirstExample, after: $afterExample) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${ExampleImage.getFragment('example')},
            }
          }
        }
        originalFulfillments: fulfillments(first: $firstFulfillment) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              uri
              ${FulfillmentImage.getFragment('fulfillment')},
            }
          }
        }
        moreFulfillments: fulfillments(first: $moreFirstFulfillment, after: $afterFulfillment) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
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
