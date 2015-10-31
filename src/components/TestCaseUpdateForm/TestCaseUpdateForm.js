'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { FlatButton } from 'material-ui';
import styles from './TestCaseUpdateForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';

import UpdateTestCaseMutation from '../../mutations/UpdateTestCaseMutation';

class TestCaseUpdateForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onChangeIt = this._onChangeIt.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'it should:'} />),
        key: this._getUUID(),
        nodes: [
          {
            component: (<ArchyInput text={props.testCase.it} placeholder={'do something epic.'} onChangeText={this._onChangeIt} />),
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
    if (it.length > 0) {
      Relay.Store.update(
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
    if (it.length > 0) {
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

TestCaseUpdateForm.propTypes = {onCancel: PropTypes.func, onUpdate: PropTypes.func};
TestCaseUpdateForm.defaultProps = {onCancel: function() {}, onUpdate: function() {}};

var TestCaseUpdateFormContainer = Relay.createContainer(TestCaseUpdateForm, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        it,
        ${UpdateTestCaseMutation.getFragment('testCase')}
      }
    `,
  },
});

export default TestCaseUpdateFormContainer;
