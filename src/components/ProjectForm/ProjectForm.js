'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FlatButton } from 'material-ui';
import styles from './ProjectForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';
import { getProjectPlaceholderText, isValidTitle } from '../../utils/utilities';
import { track, Events } from '../../utils/SMTIAnalytics';

import { IntroduceProjectMutation } from '../../mutations';

class ProjectForm extends Component {
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
    let projectPlaceholder = getProjectPlaceholderText();
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'describe:'} />),
        nodes: [
          {
            component: (<ArchyInput placeholder={projectPlaceholder} onChangeText={this._onChangeTitle} />),
            nodes: [],
          },
        ],
      },
      isDisabled: true,
      text: ''
    }
  }

  _onCreate() {
    var text = this.state.text;
    if (isValidTitle(text)) {
      Relay.Store.commitUpdate(
        new IntroduceProjectMutation({text, me: this.props.me})
      );
      //Start SMTIAnalytics
      track(Events.CREATED_PROJECT);
      //End SMTIAnalytics

      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeTitle(text) {
    var isDisabled = true;
    if (isValidTitle(text)) {
      isDisabled = false;
    }
    this.setState({
      text,
      isDisabled
    });
  }

  render() {
    return (
      <div>
        <Archy archible={this.state.archible}/>
        <div className="action-container">
          <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancel} />
          <FlatButton label="Start" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(ProjectForm, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        ${IntroduceProjectMutation.getFragment('me')}
      }
    `,
  },
});
