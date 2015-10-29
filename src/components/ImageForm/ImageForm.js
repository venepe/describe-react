'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import uuid from 'node-uuid';
import { FlatButton } from 'material-ui';
import styles from './ImageForm.css';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ArchyInput from '../ArchyInput';

import IntroduceImageMutation from '../../mutations/IntroduceImageMutation';

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._openFileDialog = this._openFileDialog.bind(this);
  }

  _onCreate(e) {
    console.log(e);
    if (e.target.files.length > 0) {
      let uri = e.target.files[0];
      Relay.Store.update(
        new IntroduceImageMutation({uri, target: this.props.target})
      );
      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  _openFileDialog() {
    let fileUploadDom = React.findDOMNode(this.refs.fileUpload);
    fileUploadDom.click();
  }

  _getUUID() {
    return uuid.v4();
  }

  componentDidMount() {
    this._openFileDialog();
  }

  render() {
    return (
        <input
        ref="fileUpload"
        type="file"
        style={{"display" : "none"}}
        onChange={this._onCreate}/>
    );
  }
}

ImageForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func};
ImageForm.defaultProps = {onCancel: function() {}, onCreate: function() {}};

var ImageFormContainer = Relay.createContainer(ImageForm, {
  fragments: {
    target: () => Relay.QL`
      fragment on Node {
        ${IntroduceImageMutation.getFragment('target')}
      }
    `,
  },
});

export default ImageFormContainer;
