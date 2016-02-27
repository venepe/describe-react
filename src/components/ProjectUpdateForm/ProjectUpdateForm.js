'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FlatButton } from 'material-ui';
import styles from './ProjectUpdateForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';
import Utilities from '../../utils/utilities';

import UpdateProjectMutation from '../../mutations/UpdateProjectMutation';

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
    let projectPlaceholder = Utilities.getProjectPlaceholderText();
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'describe:'} />),
        nodes: [
          {
            component: (<ArchyInput text={this.props.project.title} placeholder={projectPlaceholder} onChangeText={this._onChangeTitle} />),
            nodes: [],
          },
        ],
      },
      isDisabled: true,
      title: ''
    }
  }

  _onUpdate() {
    var title = this.state.title;
    if (Utilities.isValidTitle(title)) {
      Relay.Store.commitUpdate(
        new UpdateProjectMutation({title, project: this.props.project})
      );
      this.props.onUpdate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeTitle(title) {
    var isDisabled = true;
    if (Utilities.isValidTitle(title)) {
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
        title
        ${UpdateProjectMutation.getFragment('project')}
      }
    `,
  },
});
