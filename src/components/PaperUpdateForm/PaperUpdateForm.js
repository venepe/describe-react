'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { FlatButton } from 'material-ui';
import styles from './PaperUpdateForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';

import UpdatePaperMutation from '../../mutations/UpdatePaperMutation';

class PaperUpdateForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onChangeText = this._onChangeText.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'as described by:'} />),
        key: this._getUUID(),
        nodes: [
          {
            component: (<ArchyInput text={props.paper.text} placeholder={'you deep thought'} onChangeText={this._onChangeText} />),
            key: this._getUUID(),
            nodes: [],
          },
        ],
      },
      isDisabled: true,
      title: props.title,
      text: props.paper.text
    }
  }

  _onUpdate() {
    var text = this.state.text;
    if (text.length > 0) {
      Relay.Store.update(
        new UpdatePaperMutation({text, paper: this.props.paper})
      );
      this.props.onUpdate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _onChangeText(text) {
    var isDisabled = true;
    if (text.length > 0) {
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
          <FlatButton label="Update" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onUpdate} />
        </div>
      </div>
    );
  }
}

PaperUpdateForm.propTypes = {title: PropTypes.string, onCancel: PropTypes.func, onUpdate: PropTypes.func};
PaperUpdateForm.defaultProps = {title: 'Update Paper', onCancel: function() {}, onUpdate: function() {}};

var PaperUpdateFormContainer = Relay.createContainer(PaperUpdateForm, {
  fragments: {
    paper: () => Relay.QL`
      fragment on Paper {
        text,
        ${UpdatePaperMutation.getFragment('paper')}
      }
    `,
  },
});

export default PaperUpdateFormContainer;
