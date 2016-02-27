'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './RefreshTokenView.css';
import Authenticate from '../../utils/authenticate';
import SpinnerView from '../SpinnerView';

class RefreshTokenView extends Component {
  static propTypes = {
    didRefreshToken: PropTypes.func
  }

   static defaultProps = {
     didRefreshToken: function() {}
   }

  constructor(props) {
    super(props);
    this._refreshToken = this._refreshToken.bind(this);
    this._refreshToken();
    this.state = {
      doLogOff: false
    }
  }

  _refreshToken() {
    Authenticate.refreshToken()
      .then((refreshedToken) => {
        this.props.didRefreshToken();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    return <SpinnerView />
  }
}

export default RefreshTokenView;
