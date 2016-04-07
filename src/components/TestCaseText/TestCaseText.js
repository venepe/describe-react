'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import { TestCaseSheetOptions } from '../../constants/SheetOptions';
import FulfillmentFormDialog from '../FulfillmentFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';
import { diffWords } from 'diff';

import ModalTypes, { INTRODUCE_EXAMPLE, FULFILL_TEST_CASE, UPDATE_TEST_CASE, DELETE_TEST_CASE } from '../../constants/ModalTypes';

import { DeleteTestCaseMutation } from '../../mutations';
import { registerDidDeleteTestCase, registerDidUpdateTestCase, registerDidIntroduceFulfillment } from '../../stores/SubscriptionStore';
import { DidDeleteTestCaseSubscription, DidUpdateTestCaseSubscription, DidIntroduceFulfillmentSubscription } from '../../subscriptions';

class TestCaseText extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    onClick: function() {},
    onDelete: function() {}
  }

  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissTestCaseUpdateForm = this._dismissTestCaseUpdateForm.bind(this);
    this._dismissFulfillmentForm = this._dismissFulfillmentForm.bind(this);
    this.state = {
      showTestCaseUpdateForm: false,
      showFulfillmentForm: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.props.testCase.id);
  }

  _onItemTouchTap(value) {
    switch (value) {
        case FULFILL_TEST_CASE:
          this.setState({
            showFulfillmentForm: true
          });
          break;
        case UPDATE_TEST_CASE:
            this.setState({
              showTestCaseUpdateForm: true
            });
          break;
        case DELETE_TEST_CASE:
            this.props.onDelete(this.props.testCase.id);
            Relay.Store.commitUpdate(
              new DeleteTestCaseMutation({testCase: this.props.testCase, project: this.props.project})
            );
          break;
      default:
    }
  }

  _dismissTestCaseUpdateForm() {
    this.setState({
      showTestCaseUpdateForm: false
    });
  }

  _dismissFulfillmentForm() {
    this.setState({
      showFulfillmentForm: false
    });
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.project && this.props.testCase) {
      let project = this.props.project;
      let testCase = this.props.testCase;
      let projectId = project.id;
      let testCaseId = testCase.id;

      registerDidUpdateTestCase({testCaseId}, () => {
        return Relay.Store.subscribe(
          new DidUpdateTestCaseSubscription({testCase})
        );
      });

      registerDidDeleteTestCase({testCaseId, projectId}, () => {
        return Relay.Store.subscribe(
          new DidDeleteTestCaseSubscription({testCase, project})
        );
      });

      registerDidIntroduceFulfillment({testCaseId}, () => {
        return Relay.Store.subscribe(
          new DidIntroduceFulfillmentSubscription({testCase, project})
        );
      });
    }
  }

  render() {
    let currentIt = this.props.testCase.it;
    let previousIt = this.props.testCase.it;
    if (this.props.testCase.events && this.props.testCase.events.edges && this.props.testCase.events.edges.length > 1) {
      let testCaseEvent = this.props.testCase.events.edges[1].node;
      previousIt = testCaseEvent.it;
    }
    let diff = diffWords(previousIt, currentIt);
    let it = diff.map(part => {
      let added = part.added;
      let removed = part.removed;
      let backgroundColor = added ? '#69F0AE' : removed ? '#FF5252' : '#FFFFFF';
      let value = part.value;
      return (<span style={{backgroundColor}}>{value}</span>);
    });

    return (
      <div className="TestCaseText-container">
        <ModalableArchyLabel text={it} sheetOptions={TestCaseSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
        <TestCaseUpdateFormDialog isVisible={this.state.showTestCaseUpdateForm} testCase={this.props.testCase} onCancel={this._dismissTestCaseUpdateForm} onUpdate={this._dismissTestCaseUpdateForm} />
        <FulfillmentFormDialog isVisible={this.state.showFulfillmentForm} testCase={this.props.testCase} project={this.props.project} onCancel={this._dismissFulfillmentForm} />
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseText, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        it
        events(first: 2) {
          edges {
            node {
              id
              it
              createdAt
            }
          }
        }
        ${DeleteTestCaseMutation.getFragment('testCase')},
        ${TestCaseUpdateFormDialog.getFragment('testCase')},
        ${FulfillmentFormDialog.getFragment('testCase')},
        ${DidDeleteTestCaseSubscription.getFragment('testCase')},
        ${DidUpdateTestCaseSubscription.getFragment('testCase')},
        ${DidIntroduceFulfillmentSubscription.getFragment('testCase')},
      }

    `,
    project: () => Relay.QL`
      fragment on Project {
        id,
        ${DeleteTestCaseMutation.getFragment('project')},
        ${FulfillmentFormDialog.getFragment('project')},
        ${DidDeleteTestCaseSubscription.getFragment('project')},
      }
    `,
  },
});
