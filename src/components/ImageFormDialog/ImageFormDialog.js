'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { Dialog } from 'material-ui';
import styles from './ImageFormDialog.css';
import ImageForm from '../ImageForm';

import TargetRoute from '../../routes/TargetRoute';

class ImageFormDialog extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this.state = {
      targetId: props.targetId,
      component: null
    };
  }

  _onCreate() {
    this.state.component = null
  }

  _onCancel() {
    this.state.component = null
  }

  render() {
    return (
      <div>
        {this.state.component}
      </div>
    );
  }

  show(targetId) {
    let targetRoute = new TargetRoute({targetId});
    let component = (<Relay.RootContainer Component={ImageForm} route={targetRoute} renderFetched={data => <ImageForm {...data} onCancel={this._onCancel} onCreate={this._onCreate} /> } />);
    this.setState({
      component
    });
  }
}

ImageFormDialog.propTypes = {targetId: PropTypes.string};
ImageFormDialog.defaultProps = {targetId: ''};

export default ImageFormDialog;