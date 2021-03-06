'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentForm.css';
import { track, Events } from '../../utils/SMTIAnalytics';

import { UpdateFulfillmentMutation } from '../../mutations';

class FulfillmentForm extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    isOpen: PropTypes.bool
  }

  static defaultProps = {
    onCancel: function() {},
    isOpen: false
  }

  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
  }

  _onCreate(e) {
    if (e.target.files.length > 0) {
      let uri = e.target.files[0];
      const status = 'SUBMITTED';
      Relay.Store.commitUpdate(
        new UpdateFulfillmentMutation({fulfillment: this.props.fulfillment, testCase: this.props.testCase, project: this.props.project, status, uri})
      );
      //Start SMTIAnalytics
      track(Events.FULFILLED_TEST_CASE);
      //End SMTIAnalytics
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen === true) {
      this._fileUpload.click();
      this.props.onCancel();
    }
  }

  render() {
    return (
        <input
        ref={(c) => this._fileUpload = c}
        type="file"
        style={{"display" : "none"}}
        onChange={this._onCreate}/>
    );
  }
}

export default Relay.createContainer(FulfillmentForm, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on Fulfillment {
        ${UpdateFulfillmentMutation.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${UpdateFulfillmentMutation.getFragment('testCase')}
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${UpdateFulfillmentMutation.getFragment('project')},
      }
    `,
  },
});
