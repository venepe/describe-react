'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { FlatButton } from 'material-ui';
import styles from './TestCaseForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';
import { getTestCasePlaceholderText, isValidTestCase } from '../../utils/utilities';
import { track, Events } from '../../utils/SMTIAnalytics';

import { IntroduceTestCaseMutation } from '../../mutations';

class TestCaseForm extends Component {
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
    let testCasePlaceholder = getTestCasePlaceholderText();
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onChangeIt = this._onChangeIt.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'describe:'} />),
        key: this._getUUID(),
        nodes: [
          {
            component: (<ArchyLabel text={this.props.project.text} />),
            key: this._getUUID(),
            nodes: [
              {
                component: (<ArchyLabel text={'it should:'} />),
                key: this._getUUID(),
                nodes: [
                  {
                    component: (<ArchyInput placeholder={testCasePlaceholder} onChangeText={this._onChangeIt} />),
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
      text: ''
    }
  }

  _onCreate() {
    var text = this.state.text;
    if (isValidTestCase(text)) {
      Relay.Store.commitUpdate(
        new IntroduceTestCaseMutation({text, project: this.props.project})
      );
      //Start SMTIAnalytics
      track(Events.ADDED_TEST_CASE);
      //End SMTIAnalytics

      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeIt(text) {
    var isDisabled = true;
    if (isValidTestCase(text)) {
      isDisabled = false;
    }
    this.setState({
      text,
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
          <FlatButton label="Add" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(TestCaseForm, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        text,
        ${IntroduceTestCaseMutation.getFragment('project')}
      }
    `,
  },
});
