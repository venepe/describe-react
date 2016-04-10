'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseView.css';
import { Paper, Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import TestCaseLabel from '../TestCaseLabel';
import TestCaseText from '../TestCaseText';
import FulfillmentImage from '../FulfillmentImage';
import MoreButton from '../MoreButton';
import FileImage from '../FileImage';

const _first = 2;
const _next = 2;

class TestCaseView extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    onClick: function() {},
    onDelete: function() {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushFulfillment = this._pushFulfillment.bind(this);
    this._onLoadMoreFulfillments = this._onLoadMoreFulfillments.bind(this);
    this._pushRejection = this._pushRejection.bind(this);
    this._onLoadMoreRejections = this._onLoadMoreRejections.bind(this);
  }

  _pushFulfillment(fulfillmentId) {
    let projectId = this.props.project.id;
    let testCaseId = this.props.testCase.id;
    this.router.push(`/projects/${projectId}/testCases/${testCaseId}/fulfillments/${fulfillmentId}`);
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

  _pushRejection(rejectionId) {
    let projectId = this.props.project.id;
    let testCaseId = this.props.testCase.id;
    this.router.push(`/projects/${projectId}/testCases/${testCaseId}/files/${rejectionId}`);
  }

  _onLoadMoreRejections() {
    var first = this.props.relay.variables.firstRejection;
    var edges = this.props.testCase.originalRejections.edges;
    var cursor = edges[edges.length - 1].cursor;
    this.props.relay.setVariables({
      firstRejection: first + _next,
      afterRejection: cursor
    });
  }

  render() {
    let object = {};
    if (this.props.testCase) {
      let testCase = this.props.testCase;
      let fulfillmentNodes = [];
      let rejectionNodes = [];

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

      if (testCase.originalRejections) {
        let hasNextPage = testCase.originalRejections.pageInfo.hasNextPage;
        rejectionNodes = testCase.originalRejections.edges.map(function (object, index) {
          let image = object.node.file;
           let imageComponent = {
             component: (<FileImage file={image} onClick={this._pushRejection} />),
             nodes: [
               {
                 component: (<ArchyLabel text={'because:'} />),
                 nodes: [{component: (<ArchyLabel text={object.node.reason} />)}]
               }
             ]
           };
           return imageComponent;
        }.bind(this));

        if (hasNextPage) {
           let moreComponent = {
             component: (<MoreButton onClick={this._onLoadMoreRejections} />),
             nodes: []
           };
           rejectionNodes.push(moreComponent);
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

      if (fulfillmentNodes.length > 0) {
        object.nodes[0].nodes.push(
          {
            component: (<ArchyLabel text={'fulfilled:'} />),
            nodes: fulfillmentNodes
          }
        )
      }

      if (rejectionNodes.length > 0) {
        object.nodes[0].nodes.push(
          {
            component: (<ArchyLabel text={'rejected:'} />),
            nodes: rejectionNodes
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

export default Relay.createContainer(TestCaseView, {
  initialVariables: {
    firstFulfillment: _first,
    afterFulfillment: null,
    moreFirstFulfillment: _first,
    firstRejection: _first,
    afterRejection: null,
    moreFirstRejection: _first
  },
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        it
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
        originalRejections: rejections(first: $firstRejection) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              reason
              file {
                ${FileImage.getFragment('file')},
              }
            }
          }
        }
        moreRejections: rejections(first: $moreFirstRejection, after: $afterRejection) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              reason
              file {
                ${FileImage.getFragment('file')},
              }
            }
          }
        }
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
