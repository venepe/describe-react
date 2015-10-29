'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { FlatButton } from 'material-ui';
import styles from './TestCaseForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';

import IntroduceTestCaseMutation from '../../mutations/IntroduceTestCaseMutation';

class TestCaseForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onChangeIt = this._onChangeIt.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'describe:'} />),
        key: this._getUUID(),
        nodes: [
          {
            component: (<ArchyLabel text={this.props.project.title} />),
            key: this._getUUID(),
            nodes: [
              {
                component: (<ArchyLabel text={'it should:'} />),
                key: this._getUUID(),
                nodes: [
                  {
                    component: (<ArchyInput placeholder={'do something epic.'} onChangeText={this._onChangeIt} />),
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
      it: ''
    }
  }

  _onCreate() {
    var it = this.state.it;
    if (it.length > 0) {
      Relay.Store.update(
        new IntroduceTestCaseMutation({it, project: this.props.project})
      );
      this.props.onCreate();
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
          <FlatButton label="Create" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }
}

TestCaseForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func};
TestCaseForm.defaultProps = {onCancel: function() {}, onCreate: function() {}};

var TestCaseFormContainer = Relay.createContainer(TestCaseForm, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        title,
        ${IntroduceTestCaseMutation.getFragment('project')}
      }
    `,
  },
});

export default TestCaseFormContainer;
