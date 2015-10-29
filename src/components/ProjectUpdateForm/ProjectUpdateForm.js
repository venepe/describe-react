'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FlatButton } from 'material-ui';
import styles from './ProjectUpdateForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';

import UpdateProjectMutation from '../../mutations/UpdateProjectMutation';

class ProjectUpdateForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'describe:'} />),
        nodes: [
          {
            component: (<ArchyInput text={this.props.project.title} placeholder={'my awesome project'} onChangeText={this._onChangeTitle} />),
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
    if (title.length > 0) {
      Relay.Store.update(
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
          <FlatButton label="Update" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onUpdate} />
        </div>
      </div>
    );
  }
}

ProjectUpdateForm.propTypes = {onCancel: PropTypes.func, onUpdate: PropTypes.func};
ProjectUpdateForm.defaultProps = {onCancel: function() {}, onUpdate: function() {}};

var ProjectUpdateFormContainer = Relay.createContainer(ProjectUpdateForm, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        title
        ${UpdateProjectMutation.getFragment('project')}
      }
    `,
  },
});

export default ProjectUpdateFormContainer;
