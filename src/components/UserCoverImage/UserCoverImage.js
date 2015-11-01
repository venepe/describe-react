'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import CoverImage from '../CoverImage';

import CoverImageFormDialog from '../CoverImageFormDialog';

import DeleteCoverImageMutation from '../../mutations/DeleteCoverImageMutation';

import ModalTypes, { INTRODUCE_COVER_IMAGE, DELETE_COVER_IMAGE } from '../../constants/ModalTypes';

class UserCoverImage extends Component {
  constructor(props) {
    super(props);
    this._deleteImage = this._deleteImage.bind(this);
    this._presentDialog = this._presentDialog.bind(this);
    this.state = {
      isEditable: props.isEditable
    }
  }

  _presentDialog(dialogType) {
    switch (dialogType) {
        case INTRODUCE_COVER_IMAGE:
            this.refs.coverImageFormDialog.show(this.props.userCoverImage.id);
          break;
        case DELETE_COVER_IMAGE:
            this._deleteImage();
          break;
      default:

    }
  }

  _deleteImage() {
    var coverImage = {};
    if (this.props.userCoverImage.coverImages.edges.length > 0) {
      coverImage = this.props.userCoverImage.coverImages.edges[0].node;
    }
    Relay.Store.update(
      new DeleteCoverImageMutation({coverImage: coverImage, target: this.props.userCoverImage})
    );
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
        <CoverImage coverImage={coverImage} title={username} isEditable={this.state.isEditable} onMenuItemClick={this._presentDialog} history={this.props.history}/>
        <CoverImageFormDialog ref="coverImageFormDialog" />
      </div>
    );
  }
}

UserCoverImage.defaultProps = {userCoverImage: {}, isEditable: false};

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
