'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './MeView.css';
import { Paper } from 'material-ui';
import UserCoverImage from '../UserCoverImage';
let MenuDivider = require('material-ui/lib/menus/menu-divider');

import ModalTypes, { INTRODUCE_TEST_CASE, INTRODUCE_PAPER, INTRODUCE_IMAGE, FULFILL_PROJECT, UPDATE_PAPER, UPDATE_PROJECT, UPDATE_TEST_CASE, DELETE_PROJECT, DELETE_TEST_CASE, DELETE_IMAGE, DELETE_PAPER } from '../../constants/ModalTypes';

class MeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.me) {
      let fullName = this.props.me.fullName || ' ';
      let summary = this.props.me.summary || 'No summary';
      return (
        <div className="MeView-container">
          <UserCoverImage userCoverImage={this.props.me} isEditable={true} history={this.props.history} />
          <div className="me-container">
            <div className="username">{this.props.me.username}</div>
            <div className="full-name">{fullName}</div>
            <MenuDivider />
            <div className="label">Summary</div>
            <div className="summary">{summary}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}

export default Relay.createContainer(MeView, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        id
        username
        email
        fullName
        summary
        projects(first: 10) {
          edges {
            node {
              id
              title
            }
          }
        }
        ${UserCoverImage.getFragment('userCoverImage')}
      }
    `,
  },
});
