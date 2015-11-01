'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectCoverImage.css';
import CoverImage from '../CoverImage';

import CoverImageFormDialog from '../CoverImageFormDialog';

import DeleteCoverImageMutation from '../../mutations/DeleteCoverImageMutation';

import ModalTypes, { INTRODUCE_COVER_IMAGE, DELETE_COVER_IMAGE } from '../../constants/ModalTypes';

class ProjectCoverImage extends Component {
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
            this.refs.coverImageFormDialog.show(this.props.projectCoverImage.id);
          break;
        case DELETE_COVER_IMAGE:
            this._deleteImage();
          break;
      default:

    }
  }

  _deleteImage() {
    var coverImage = {};
    if (this.props.projectCoverImage.coverImages.edges.length > 0) {
      coverImage = this.props.projectCoverImage.coverImages.edges[0].node;
    }
    Relay.Store.update(
      new DeleteCoverImageMutation({coverImage: coverImage, target: this.props.projectCoverImage})
    );
  }

  render() {
    var coverImage = {};
    var title = ''
      if (this.props.projectCoverImage && this.props.projectCoverImage.coverImages && this.props.projectCoverImage.coverImages.edges.length > 0) {
        coverImage = this.props.projectCoverImage.coverImages.edges[0].node;
        title = this.props.projectCoverImage.title;
      }
    return (
      <div className="ProjectCoverImage-container">
        <CoverImage coverImage={coverImage} title={title} isEditable={this.state.isEditable} onMenuItemClick={this._presentDialog}/>
        <CoverImageFormDialog ref="coverImageFormDialog" />
      </div>
    );
  }
}

ProjectCoverImage.defaultProps = {projectCoverImage: {}, isEditable: false};

export default Relay.createContainer(ProjectCoverImage, {
  fragments: {
    projectCoverImage: () => Relay.QL`
      fragment on Project {
        id
        title
        coverImages(first: 1) {
          edges {
            node {
              id
              uri
              ${DeleteCoverImageMutation.getFragment('coverImage')},
            }
          }
        }
        ${DeleteCoverImageMutation.getFragment('target')},
      }
    `,
  },
});
