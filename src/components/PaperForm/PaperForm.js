'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { FlatButton } from 'material-ui';
import styles from './PaperForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';

import IntroducePaperMutation from '../../mutations/IntroducePaperMutation';

class PaperForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onChangeText = this._onChangeText.bind(this);

    this.state = {
      archible: {
        component: (<ArchyLabel text={'as described by:'} />),
        key: this._getUUID(),
        nodes: [
          {
            component: (<ArchyInput placeholder={'your deep thought'} onChangeText={this._onChangeText} />),
            key: this._getUUID(),
            nodes: [],
          },
        ],
      },
      isDisabled: true,
      title: props.title,
      text: ''
    }
  }

  _onCreate() {
    var text = this.state.text;
    if (text.length > 0) {
      Relay.Store.update(
        new IntroducePaperMutation({text, target: this.props.target})
      );
      this.props.onCreate();
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
          <FlatButton label="Create" disabled={this.state.isDisabled} primary={true} onTouchTap={this._onCreate} />
        </div>
      </div>
    );
  }
}

PaperForm.propTypes = {title: PropTypes.string, onCancel: PropTypes.func, onCreate: PropTypes.func};
PaperForm.defaultProps = {title: 'Add Paper', onCancel: function() {}, onCreate: function() {}};

var PaperFormContainer = Relay.createContainer(PaperForm, {
  fragments: {
    target: () => Relay.QL`
      fragment on Node {
        ${IntroducePaperMutation.getFragment('target')}
      }
    `,
  },
});

export default PaperFormContainer;
