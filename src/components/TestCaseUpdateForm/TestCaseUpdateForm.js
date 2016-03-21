'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { FlatButton } from 'material-ui';
import styles from './TestCaseUpdateForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';
import { getTestCasePlaceholderText, isValidTestCase } from '../../utils/utilities';

import { UpdateTestCaseMutation } from '../../mutations';

class TestCaseUpdateForm extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func
  }

  static defaultProps = {
    onCancel: function() {},
    onUpdate: function() {}
  }

  constructor(props) {
    super(props);
    let testCasePlaceholder = getTestCasePlaceholderText();
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onChangeIt = this._onChangeIt.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'it should:'} />),
        key: this._getUUID(),
        nodes: [
          {
            component: (<ArchyInput text={props.testCase.it} placeholder={testCasePlaceholder} onChangeText={this._onChangeIt} />),
            key: this._getUUID(),
            nodes: [],
          },
        ],
      },
      isDisabled: true,
      it: ''
    }
  }

  _onUpdate() {
    var it = this.state.it;
    if (isValidTestCase(it)) {
      Relay.Store.commitUpdate(
        new UpdateTestCaseMutation({it, testCase: this.props.testCase})
      );
      this.props.onUpdate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeIt(it) {
    var isDisabled = true;
    if (isValidTestCase(it)) {
      isDisabled = false;
    }
    this.setState({
      it,
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
          <FlatButton label="Update" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onUpdate} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseUpdateForm, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        it,
        ${UpdateTestCaseMutation.getFragment('testCase')}
      }
    `,
  },
});
