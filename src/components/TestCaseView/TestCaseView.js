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
    this._pushImage = this._pushImage.bind(this);
    this._onDelete = this._onDelete.bind(this);
  }

  _pushImage(id) {
    this.props.history.pushState(null, '/images/' + id);
  }

  _onDelete() {
  }

  render() {
    let object = {};
    if (this.props.testCase) {

      let exampleNodes = this.props.testCase.examples.edges.map(function (object, index) {
         let image = object.node;
          let imageComponent = {
            component: (<ExampleImage example={image} target={this.props.testCase} onClick={this._pushImage} />),
          };
          return imageComponent;
        }.bind(this));

      let fulfillmentNodes = this.props.testCase.fulfillments.edges.map(function (object, index) {
        let image = object.node;
         let imageComponent = {
           component: (<FulfillmentImage fulfillment={image} testCase={this.props.testCase} onClick={this._pushImage} />),
         };
         return imageComponent;
      }.bind(this));

      object = {
        component: (<TestCaseLabel testCase={this.props.testCase} />),
        nodes: [
          {
            component: (<TestCaseText testCase={this.props.testCase} project={this.props.project} onDelete={this._onDelete}/>),
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
        ${TestCaseText.getFragment('project')},
      }
    `,
  },
});
