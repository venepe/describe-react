'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseImage.css';
import { Card, CardMedia, CardTitle } from 'material-ui';
import ConfirmationDialog from '../ConfirmationDialog';
import FulfillmentFormDialog from '../FulfillmentFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';
import MessageableImage from '../MessageableImage';
import MessageButton from '../MessageButton';
import { SubmitTestCaseSheetOptions, RejectTestCaseSheetOptions } from '../../constants/SheetOptions';
import { track, Events } from '../../utils/SMTIAnalytics';

import ModalTypes, { SUBMIT_FULFILLMENT, REJECT_FULFILLMENT, UPDATE_TEST_CASE, DELETE_TEST_CASE } from '../../constants/ModalTypes';

import { DeleteTestCaseMutation, UpdateFulfillmentMutation, UpdateTestCaseMutation } from '../../mutations';
import { registerDidDeleteTestCase, registerDidUpdateFulfillment, registerDidUpdateTestCase } from '../../stores/SubscriptionStore';
import { DidDeleteTestCaseSubscription, DidUpdateFulfillmentSubscription, DidUpdateTestCaseSubscription } from '../../subscriptions';

class TestCaseImage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    key: PropTypes.number,
    height: PropTypes.number,
    onClick: PropTypes.func,
    overlay: PropTypes.element,
  }

  static defaultProps = {
    key: 0,
    height: 400,
    onClick: function() {},
    overlay: null,
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushMessages = this._pushMessages.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onReject = this._onReject.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissTestCaseUpdateForm = this._dismissTestCaseUpdateForm.bind(this);
    this._dismissFulfillmentForm = this._dismissFulfillmentForm.bind(this);
    this._dismissDeleteTestCaseDialog = this._dismissDeleteTestCaseDialog.bind(this);
    this._dismissRejectFulfillmentDialog = this._dismissRejectFulfillmentDialog.bind(this);
    this.getFulfillment = this.getFulfillment.bind(this);
    let testCaseSheet = SubmitTestCaseSheetOptions;
    if (this.props.testCase.status === 'SUBMITTED') {
      testCaseSheet = RejectTestCaseSheetOptions;
    }
    this.state = {
      testCaseSheet,
      showFulfillmentForm: false,
      showTestCaseUpdateForm: false,
      showDeleteTestCaseDialog: false,
      showRejectFulfillmentDialog: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testCase) {
      let testCaseSheet = SubmitTestCaseSheetOptions;
      if (nextProps.testCase.status === 'SUBMITTED') {
        testCaseSheet = RejectTestCaseSheetOptions;
      }
      this.setState({
        testCaseSheet
      });
    }
  }

  _pushMessages() {
    let channelId = this.props.testCase.id;
    this.router.push(`/channels/${channelId}/messages`);
  }

  _onItemTouchTap(value) {
    switch (value) {
        case SUBMIT_FULFILLMENT:
          this.setState({
            showFulfillmentForm: true
          });
          break;
        case REJECT_FULFILLMENT:
          this.setState({
            showRejectFulfillmentDialog: true
          });
          break;
        case UPDATE_TEST_CASE:
          this.setState({
            showTestCaseUpdateForm: true
          });
          break;
        case DELETE_TEST_CASE:
          this.setState({
            showDeleteTestCaseDialog: true
          });
          break;
      default:
    }
  }

  _dismissTestCaseUpdateForm() {
    this.setState({
      showTestCaseUpdateForm: false
    });
  }

  _dismissDeleteTestCaseDialog() {
    this.setState({
      showDeleteTestCaseDialog: false
    });
  }

  _dismissRejectFulfillmentDialog() {
    this.setState({
      showRejectFulfillmentDialog: false
    });
  }

  _dismissFulfillmentForm() {
    this.setState({
      showFulfillmentForm: false
    });
  }

  _onReject() {
    const status = 'REJECTED';
    this._dismissRejectFulfillmentDialog();
    let testCase = this.props.testCase || {};
    let fulfillment = this.getFulfillment();
    Relay.Store.commitUpdate(
      new UpdateFulfillmentMutation({fulfillment, testCase, status, project: this.props.project})
    );

    //Start SMTIAnalytics
    track(Events.REJECTED_FULFILLMENT);
    //End SMTIAnalytics

  }


  _onDelete() {
    this._dismissDeleteTestCaseDialog();
    Relay.Store.commitUpdate(
      new DeleteTestCaseMutation({testCase: this.props.testCase, project: this.props.project})
    );
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
      let fulfillment = this.getFulfillment();
      let fulfillmentId = fulfillment.id;

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

      registerDidUpdateFulfillment({fulfillmentId, testCaseId}, () => {
        return Relay.Store.subscribe(
          new DidUpdateFulfillmentSubscription({fulfillment, testCase})
        );
      });
    }
  }

  getFulfillment() {
    let fulfillment = {};
    let testCase = this.props.testCase || {};
    let fulfillments = testCase.fulfillments || {};
    let edges = fulfillments.edges || [];
    if (edges.length > 0) {
      fulfillment = edges[0].node || {};
    }

    return fulfillment;
  }

  render() {
    let uri = '';
    let fulfillmentId = '';
    let testCase = this.props.testCase || {};
    let fulfillment = this.getFulfillment();
    uri = fulfillment.uri;
    fulfillmentId = fulfillment.id;
    return (
      <div className="TestCaseImage-container">
        <MessageableImage height={this.props.height} overlay={this.props.overlay} src={uri} sheetOptions={this.state.testCaseSheet} onItemTouchTap={this._onItemTouchTap} onClick={this.props.onClick} onMessage={this._pushMessages}/>
        <ConfirmationDialog isVisible={this.state.showRejectFulfillmentDialog} title={'Reject Fulfillment?'} message={'Do you wish to continue?'} onCancel={this._dismissRejectFulfillmentDialog} onConfirm={this._onReject} />
        <ConfirmationDialog isVisible={this.state.showDeleteTestCaseDialog} title={'Delete Test Case?'} message={'Do you wish to continue?'} onCancel={this._dismissDeleteTestCaseDialog} onConfirm={this._onDelete} />
        <FulfillmentFormDialog isVisible={this.state.showFulfillmentForm} fulfillment={fulfillment} testCase={this.props.testCase} project={this.props.project} onCancel={this._dismissFulfillmentForm} />
        <TestCaseUpdateFormDialog isVisible={this.state.showTestCaseUpdateForm} testCase={this.props.testCase} onCancel={this._dismissTestCaseUpdateForm} onUpdate={this._dismissTestCaseUpdateForm} />
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseImage, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        status
        text
        fulfillments(first: 1) {
          edges {
            cursor
            node {
              id
              status
              uri
              ${FulfillmentFormDialog.getFragment('fulfillment')},
              ${UpdateFulfillmentMutation.getFragment('fulfillment')},
              ${DidUpdateFulfillmentSubscription.getFragment('fulfillment')},
            }
          }
        }
        ${FulfillmentFormDialog.getFragment('testCase')},
        ${TestCaseUpdateFormDialog.getFragment('testCase')},
        ${DeleteTestCaseMutation.getFragment('testCase')},
        ${UpdateFulfillmentMutation.getFragment('testCase')},
        ${DidDeleteTestCaseSubscription.getFragment('testCase')},
        ${DidUpdateTestCaseSubscription.getFragment('testCase')},
        ${DidUpdateFulfillmentSubscription.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        ${FulfillmentFormDialog.getFragment('project')},
        ${DeleteTestCaseMutation.getFragment('project')},
        ${UpdateFulfillmentMutation.getFragment('project')},
        ${DidDeleteTestCaseSubscription.getFragment('project')},
      }
    `,
  },
});
