'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { FlatButton } from 'material-ui';
import styles from './RejectionForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';
import FileImage from '../FileImage';
import { getRejectionPlaceholderText, isValidRejection } from '../../utils/utilities';
import { track, Events } from '../../utils/SMTIAnalytics';

import { RejectFulfillmentMutation } from '../../mutations';

class RejectionForm extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onCreate: PropTypes.func
  }

  static defaultProps = {
    onCancel: function() {},
    onCreate: function() {}
  }

  constructor(props) {
    super(props);
    let rejectionPlaceholder = getRejectionPlaceholderText();
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onChangeReason = this._onChangeReason.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'reject:'} />),
        key: this._getUUID(),
        nodes: [
          {
            component: (<FileImage file={this.props.fulfillment} />),
            key: this._getUUID(),
            nodes: [
              {
                component: (<ArchyLabel text={'because:'} />),
                key: this._getUUID(),
                nodes: [
                  {
                    component: (<ArchyInput placeholder={rejectionPlaceholder} onChangeText={this._onChangeReason} />),
                    key: this._getUUID(),
                    nodes: [],
                  },
                ],
              }
            ],
          },
        ],
      },
      isDisabled: true,
      reason: ''
    }
  }

  _onCreate() {
    var reason = this.state.reason;
    if (isValidRejection(reason)) {
      Relay.Store.commitUpdate(
        new RejectFulfillmentMutation({fulfillment: this.props.fulfillment, testCase: this.props.testCase, project: this.props.project, reason})
      );
      //Start SMTIAnalytics
      // track(Events.ADDED_TEST_CASE);
      //End SMTIAnalytics

      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeReason(reason) {
    var isDisabled = true;
    if (isValidRejection(reason)) {
      isDisabled = false;
    }
    this.setState({
      reason,
      isDisabled
    });
  }

  _getUUID() {
    return uuid.v4();
  }

  render() {
    return (
      <div>
        <Archy archible={this.state.archible}/>
        <div className="action-container">
          <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancel} />
          <FlatButton label="Reject" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(RejectionForm, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on File {
        ${FileImage.getFragment('file')},
        ${RejectFulfillmentMutation.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${RejectFulfillmentMutation.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${RejectFulfillmentMutation.getFragment('project')},
      }
    `,
  },
});
