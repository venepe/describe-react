'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { FlatButton } from 'material-ui';
import styles from './ProjectFulfillmentForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';
import SMTIStorage from '../../utils/storage';

import FulfillProjectMutation from '../../mutations/FulfillProjectMutation';

class ProjectFulfillmentForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'describe:'} />),
        nodes: [
          {
            component: (<ArchyInput placeholder={'my awesome project'} onChangeText={this._onChangeTitle} />),
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
      var meId = SMTIStorage.getMeIdFromLocalStorage();
      Relay.Store.update(
        new FulfillProjectMutation({title, testCase: this.props.testCase, me: {id: meId}})
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

ProjectFulfillmentForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func};
ProjectFulfillmentForm.defaultProps = {onCancel: function() {}, onCreate: function() {}};

var ProjectFulfillmentFormContainer = Relay.createContainer(ProjectFulfillmentForm, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        it,
        ${FulfillProjectMutation.getFragment('testCase')}
      }
    `,
  },
});

export default ProjectFulfillmentFormContainer;
