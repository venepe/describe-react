'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FlatButton } from 'material-ui';
import styles from './ProjectUpdateForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';
import { getProjectPlaceholderText, isValidTitle } from '../../utils/utilities';

import { UpdateProjectMutation } from '../../mutations';

class ProjectUpdateForm extends Component {

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
    let projectPlaceholder = getProjectPlaceholderText();
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'describe'} />),
        nodes: [
          {
            component: (<ArchyInput text={this.props.project.text} placeholder={projectPlaceholder} onChangeText={this._onChangeTitle} />),
            nodes: [],
          },
        ],
      },
      isDisabled: true,
      text: ''
    }
  }

  _onUpdate() {
    var text = this.state.text;
    if (isValidTitle(text)) {
      Relay.Store.commitUpdate(
        new UpdateProjectMutation({text, project: this.props.project})
      );
      this.props.onUpdate();
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
          <FlatButton label="Update" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onUpdate} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(ProjectUpdateForm, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        text
        ${UpdateProjectMutation.getFragment('project')}
      }
    `,
  },
});
