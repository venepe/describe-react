'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ImageForm.css';

import IntroduceExampleMutation from '../../mutations/IntroduceExampleMutation';

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
  }

  _onCreate(e) {
    if (e.target.files.length > 0) {
      let uri = e.target.files[0];
      Relay.Store.update(
        new IntroduceExampleMutation({uri, target: this.props.target})
      );
      this.props.onCreate();
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen === true) {
      this._fileUpload.click();
    }
  }

  componentDidMount() {
    this._fileUpload.click();
  }

  render() {
    return (
        <input
        ref={(c) => this._fileUpload = c}
        type="file"
        style={{"display" : "none"}}
        onChange={this._onCreate}/>
    );
  }
}

ImageForm.propTypes = {onCancel: PropTypes.func, onCreate: PropTypes.func, isOpen: PropTypes.boolean};
ImageForm.defaultProps = {onCancel: function() {}, onCreate: function() {}, isOpen: false};

var ImageFormContainer = Relay.createContainer(ImageForm, {
  fragments: {
    target: () => Relay.QL`
      fragment on Node {
        ${IntroduceExampleMutation.getFragment('target')}
      }
    `,
  },
});

export default ImageFormContainer;
