'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './TestCaseText.css';
import ModalableArchyLabel from '../ModalableArchyLabel';
import SheetOptions from '../../constants/SheetOptions';
import ExampleFormDialog from '../ExampleFormDialog';
import FulfillmentFormDialog from '../FulfillmentFormDialog';
import TestCaseUpdateFormDialog from '../TestCaseUpdateFormDialog';

import ModalTypes, { INTRODUCE_EXAMPLE, FULFILL_TEST_CASE, UPDATE_TEST_CASE, DELETE_TEST_CASE } from '../../constants/ModalTypes';

import DeleteTestCaseMutation from '../../mutations/DeleteTestCaseMutation';

class TestCaseText extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissTestCaseUpdateForm = this._dismissTestCaseUpdateForm.bind(this);
    this._dismissExampleForm = this._dismissExampleForm.bind(this);
    this._dismissFulfillmentForm = this._dismissFulfillmentForm.bind(this);
    this.state = {
      showTestCaseUpdateForm: false,
      showExampleForm: false,
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
        case INTRODUCE_EXAMPLE:
          this.setState({
            showExampleForm: true
          });
          break;
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

  _dismissExampleForm() {
    this.setState({
      showExampleForm: false
    });
  }

  _dismissFulfillmentForm() {
    this.setState({
      showFulfillmentForm: false
    });
  }

  render() {

    return (
      <div className="TestCaseText-container">
        <ModalableArchyLabel text={this.props.testCase.it} sheetOptions={SheetOptions.testCaseSheet} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
        <TestCaseUpdateFormDialog isVisible={this.state.showTestCaseUpdateForm} testCase={this.props.testCase} onCancel={this._dismissTestCaseUpdateForm} onUpdate={this._dismissTestCaseUpdateForm} />
        <ExampleFormDialog isVisible={this.state.showExampleForm} target={this.props.testCase} onCancel={this._dismissExampleForm} />
        <FulfillmentFormDialog isVisible={this.state.showFulfillmentForm} testCase={this.props.testCase} project={this.props.project} onCancel={this._dismissFulfillmentForm} />
      </div>
    );
  }
}

TestCaseText.propTypes = {onClick: PropTypes.func, onDelete: PropTypes.func};
TestCaseText.defaultProps = {onClick: function() {}, onDelete: function() {}};

var TestCaseTextContainer = Relay.createContainer(TestCaseText, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        it
        ${DeleteTestCaseMutation.getFragment('testCase')},
        ${TestCaseUpdateFormDialog.getFragment('testCase')},
        ${ExampleFormDialog.getFragment('target')},
        ${FulfillmentFormDialog.getFragment('testCase')},
      }

    `,
    project: () => Relay.QL`
      fragment on Project {
        id,
        ${DeleteTestCaseMutation.getFragment('project')},
        ${FulfillmentFormDialog.getFragment('project')},
      }
    `,
  },
});

module.exports = TestCaseTextContainer;
