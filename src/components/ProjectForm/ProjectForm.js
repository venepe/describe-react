'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FlatButton } from 'material-ui';
import styles from './ProjectForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';
import Utilities from '../../utils/utilities';

import IntroduceProjectMutation from '../../mutations/IntroduceProjectMutation';

class ProjectForm extends Component {
  constructor(props) {
    super(props);
    let projectPlaceholder = Utilities.getProjectPlaceholderText();
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
      title: ''
    }
  }

  _onCreate() {
    var title = this.state.title;
    if (title.length > 0) {
      Relay.Store.update(
        new IntroduceProjectMutation({title, me: this.props.me})
      );
      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeTitle(title) {
    var isDisabled = true;
    if (title.length > 0) {
      isDisabled = false;
    }
    this.setState({
      title,
      isDisabled
    });
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

ProjectForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func};
ProjectForm.defaultProps = {onCancel: function() {}, onCreate: function() {}};

var ProjectFormContainer = Relay.createContainer(ProjectForm, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        ${IntroduceProjectMutation.getFragment('me')}
      }
    `,
  },
});

export default ProjectFormContainer;
