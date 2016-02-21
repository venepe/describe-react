'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './UserView.css';
import { Paper } from 'material-ui';
import FileImage from '../FileImage';
import Divider from 'material-ui/lib/divider';

class UserView extends Component {
  constructor(props) {
    super(props);
    this._pushCoverImage = this._pushCoverImage.bind(this);
  }

  _pushCoverImage(fileId) {
    let userId = this.props.user.id;
    this.props.history.pushState(null, `/users/${userId}/files/${fileId}`);
  }

  render() {
    if (this.props.user) {
      let fullName = this.props.user.fullName || ' ';
      let summary = this.props.user.summary || 'No summary';
      let coverImage = null;
      if (this.props.user && this.props.user.coverImages && this.props.user.coverImages.edges.length > 0) {
        coverImage = this.props.user.coverImages.edges[0].node;
      }
      return (
        <div className="UserView-container">
          <FileImage file={coverImage} height={400} width={null} onClick={this._pushCoverImage}/>
          <div className="user-container">
            <div className="name">{this.props.user.name}</div>
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

export default Relay.createContainer(UserView, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        name
        email
        fullName
        summary
        coverImages(first: 1) {
          edges {
            node {
              ${FileImage.getFragment('file')},
            }
          }
        }
      }
    `,
  },
});
