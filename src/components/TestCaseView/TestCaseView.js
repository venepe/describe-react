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

  render() {
    let object = {};
    if (this.props.testCase) {
      let testCase = this.props.testCase;
      let fulfillmentNodes = [];

      if (testCase.originalFulfillments) {
        let hasNextPage = testCase.originalFulfillments.pageInfo.hasNextPage;
        fulfillmentNodes = testCase.originalFulfillments.edges.map(function (object, index) {
          let image = object.node;
           let imageComponent = {
             component: (<FulfillmentImage fulfillment={image} testCase={this.props.testCase} project={this.props.project} onClick={this._pushFulfillment} />),
             nodes:[]
           };

           if (image.reason) {
             let reasonComponent = {
               component: (<ArchyLabel text={'because:'} />),
               nodes: [{component: (<ArchyLabel text={image.reason} />)}]
             }
             imageComponent.nodes.push(reasonComponent);
           }
            return {
               component: (<ArchyLabel text={`fulfillment ${image.status.toLowerCase()}:`} />),
               nodes: [imageComponent]
             };
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
            nodes: fulfillmentNodes
          }
        ]
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
    moreFirstFulfillment: _first
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
              status
              reason
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
              status
              reason
              ${FulfillmentImage.getFragment('fulfillment')},
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
