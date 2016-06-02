'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { IconButton, FontIcon, Styles } from 'material-ui';
import styles from './TestCaseText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import { TestCaseSheetOptions } from '../../constants/SheetOptions';
import FulfillmentFormDialog from '../FulfillmentFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';
import ConfirmationDialog from '../ConfirmationDialog';

import ModalTypes, { INTRODUCE_EXAMPLE, FULFILL_TEST_CASE, UPDATE_TEST_CASE, DELETE_TEST_CASE } from '../../constants/ModalTypes';

import { DeleteTestCaseMutation } from '../../mutations';
import { registerDidDeleteTestCase, registerDidUpdateTestCase, registerDidIntroduceFulfillment } from '../../stores/SubscriptionStore';
import { DidDeleteTestCaseSubscription, DidUpdateTestCaseSubscription, DidIntroduceFulfillmentSubscription } from '../../subscriptions';

class TestCaseText extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    onClick: function() {},
    onDelete: function() {}
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onClick = this._onClick.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissTestCaseUpdateForm = this._dismissTestCaseUpdateForm.bind(this);
    this._dismissFulfillmentForm = this._dismissFulfillmentForm.bind(this);
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this._pushMessages = this._pushMessages.bind(this);
    this.state = {
      showTestCaseUpdateForm: false,
      showFulfillmentForm: false,
      showConfirmationDialog: false
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
            this.setState({
              showConfirmationDialog: true
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

  _dismissFulfillmentForm() {
    this.setState({
      showFulfillmentForm: false
    });
  }

  _dismissConfirmationDialog() {
    this.setState({
      showConfirmationDialog: false
    });
  }

  _onDelete() {
    this._dismissConfirmationDialog();
    this.props.onDelete(this.props.testCase.id);
    Relay.Store.commitUpdate(
      new DeleteTestCaseMutation({testCase: this.props.testCase, project: this.props.project})
    );
  }

  _pushMessages() {
    let channelId = this.props.testCase.id;
    this.router.push(`/channels/${channelId}/messages`);
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

    return (
      <div className="TestCaseText-container">
        <ModalableArchyLabel text={this.props.testCase.text} sheetOptions={TestCaseSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
        <TestCaseUpdateFormDialog isVisible={this.state.showTestCaseUpdateForm} testCase={this.props.testCase} onCancel={this._dismissTestCaseUpdateForm} onUpdate={this._dismissTestCaseUpdateForm} />
        <FulfillmentFormDialog isVisible={this.state.showFulfillmentForm} testCase={this.props.testCase} project={this.props.project} onCancel={this._dismissFulfillmentForm} />
        <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Delete Test Case?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onDelete} />
        <div className="message">
          <IconButton style={{width: '24px', padding: '0px'}} onMouseUp={this._pushMessages} onTouchEnd={this._pushMessages}><FontIcon className="material-icons" color={Styles.Colors.grey600}>chat_bubble</FontIcon></IconButton>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseText, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        text
        events(first: 2) {
          edges {
            node {
              id
              text
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
