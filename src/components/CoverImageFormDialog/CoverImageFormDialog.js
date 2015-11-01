'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CoverImageFormDialog.css';
import CoverImageForm from '../CoverImageForm';

import TargetRoute from '../../routes/TargetRoute';

class CoverImageFormDialog extends Component {
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
    let component = (<Relay.RootContainer Component={CoverImageForm} route={targetRoute} renderFetched={data => <CoverImageForm {...data} onCancel={this._onCancel} onCreate={this._onCreate} /> } />);
    this.setState({
      component
    });
  }
}

CoverImageFormDialog.propTypes = {targetId: PropTypes.string};
CoverImageFormDialog.defaultProps = {targetId: ''};

export default CoverImageFormDialog;
