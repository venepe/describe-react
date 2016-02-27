'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './MeView.css';
import { Paper } from 'material-ui';
import CoverImage from '../CoverImage';
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
      let coverImage = null;
      if (this.props.me && this.props.me.coverImages && this.props.me.coverImages.edges.length > 0) {
        coverImage = this.props.me.coverImages.edges[0].node;
      }
      return (
        <div className="MeView-container">
          <CoverImage coverImage={coverImage} height={400} width={null} target={this.props.me} onClick={this._pushCoverImage}/>
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
        coverImages(first: 1) {
          edges {
            node {
              ${CoverImage.getFragment('coverImage')},
            }
          }
        }
        ${CoverImage.getFragment('target')},
      }
    `,
  },
});
