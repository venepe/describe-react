'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import CoverImage from '../CoverImage';

import DeleteCoverImageMutation from '../../mutations/DeleteCoverImageMutation';

class UserCoverImage extends Component {
  constructor(props) {
    super(props);
    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._deleteImage = this._deleteImage.bind(this);
    this._pushCoverImageUploadListView = this._pushCoverImageUploadListView.bind(this);

    this.state = {
      isModalOpen: false
    };
  }

  _openModal() {
    this.setState({
      isModalOpen: true
    });
  }

  _closeModal() {
    this.setState({
      isModalOpen: false,
    });
  }

  _pushCoverImageUploadListView() {
    this.setState({isModalOpen: false});
  }

  _deleteImage() {
    var coverImage = {};
    if (this.props.userCoverImage.coverImages.edges.length > 0) {
      coverImage = this.props.userCoverImage.coverImages.edges[0].node;
    }
    Relay.Store.update(
      new DeleteCoverImageMutation({coverImage: coverImage, target: this.props.userCoverImage})
    );
    this.setState({isModalOpen: false});
  }

  render() {
    var coverImage = {};
    var username = '';
      if (this.props.userCoverImage && this.props.userCoverImage.coverImages && this.props.userCoverImage.coverImages.edges.length > 0) {
        coverImage = this.props.userCoverImage.coverImages.edges[0].node;
        username = this.props.userCoverImage.username;
      }
    return (
      <div className="UserCoverImage-container">
        <CoverImage coverImage={coverImage} title={username} onLongPress={this._openModal}/>
      </div>
    );
  }
}

UserCoverImage.defaultProps = {userCoverImage: {}};

export default Relay.createContainer(UserCoverImage, {
  fragments: {
    userCoverImage: () => Relay.QL`
      fragment on User {
        id
        username
        coverImages(first: 1) {
          edges {
            node {
              id
              uri
            }
          }
        }
      }
    `,
  },
});
