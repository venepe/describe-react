'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './RefreshTokenView.css';

class RefreshTokenView extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
      </div>
    );
  }
}

RefreshTokenView.propTypes = {didRefreshToken: PropTypes.func};
RefreshTokenView.defaultProps = {didRefreshToken: function() {}};

export default RefreshTokenView;
