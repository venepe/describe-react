'use strict';

import React, { Component } from 'react';
import Relay from 'react-relay';
import CoverImage from '../CoverImage';
import SMTIToolbar from '../SMTIToolbar';
import styles from './CoverImageView.css';

class CoverImageView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._goBack = this._goBack.bind(this);
  }

  _goBack() {
    let pathname = this.props.location.pathname;
    if (pathname.indexOf('/me/') !== -1) {
      this.router.replace('/me');
    } else {
      let path = pathname.replace(/\/coverImages.*/, '');
      this.router.replace(path);
    }

  }

  render() {
    return (
      <div>
        <SMTIToolbar title={this.props.user.name} />
        <CoverImage coverImage={this.props.coverImage} user={this.props.user} height={500} width={null} onDelete={this._goBack} onCreate={this._goBack} />
      </div>
    );
  }
}

export default Relay.createContainer(CoverImageView, {
  fragments: {
    coverImage: () => Relay.QL`
      fragment on File {
        ${CoverImage.getFragment('coverImage')},
      }
    `,
    user: () => Relay.QL`
      fragment on User {
        name
        ${CoverImage.getFragment('user')},
      }
    `,
  },
});
