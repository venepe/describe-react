'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './MeView.css';
import { Paper } from 'material-ui';
import CoverImage from '../CoverImage';
import SMTIToolbar from '../SMTIToolbar';
import Divider from 'material-ui/lib/divider';

import ModalTypes, { INTRODUCE_TEST_CASE, INTRODUCE_PAPER, INTRODUCE_EXAMPLE, FULFILL_PROJECT, UPDATE_PAPER, UPDATE_PROJECT, UPDATE_TEST_CASE, DELETE_PROJECT, DELETE_TEST_CASE, DELETE_EXAMPLE, DELETE_PAPER } from '../../constants/ModalTypes';

class MeView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushCoverImage = this._pushCoverImage.bind(this);
  }

  _pushCoverImage(coverImageId) {
    let meId = this.props.me.id;
    this.router.push(`/me/${meId}/coverImages/${coverImageId}`);
  }

  render() {
    if (this.props.me) {
      let fullName = this.props.me.fullName || ' ';
      let summary = this.props.me.summary || 'No summary';
      return (
        <div className="MeView-container">
          <SMTIToolbar title={'Me'} />
          <CoverImage coverImage={this.props.me.cover} height={400} width={null} user={this.props.me} onClick={this._pushCoverImage}/>
          <div className="me-container">
            <div className="name">{this.props.me.name}</div>
            <div className="full-name">{fullName}</div>
            <Divider />
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
        name
        email
        fullName
        summary
        cover {
          ${CoverImage.getFragment('coverImage')},
        }
        contacts (first: 30) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              name
            }
          }
        }
        ${CoverImage.getFragment('user')},
      }
    `,
  },
});
