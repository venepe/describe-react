'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import CoverImage from '../CoverImage';

import DeleteCoverImageMutation from '../../mutations/DeleteCoverImageMutation';

class ProjectCoverImage extends Component {
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
    if (this.props.projectCoverImage.coverImages.edges.length > 0) {
      coverImage = this.props.projectCoverImage.coverImages.edges[0].node;
    }
    Relay.Store.update(
      new DeleteCoverImageMutation({coverImage: coverImage, target: this.props.projectCoverImage})
    );
    this.setState({isModalOpen: false});
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
        <CoverImage coverImage={coverImage} title={title} onLongPress={this._openModal}/>
      </div>
    );
  }
}

ProjectCoverImage.defaultProps = {projectCoverImage: {}};

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
