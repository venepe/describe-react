'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CoverImage.css';
import ModalableImage from '../ModalableImage';
import CoverImageFormDialog from '../CoverImageFormDialog';
import { CoverImageSheetOptions } from '../../constants/SheetOptions';

import ModalTypes, { CHANGE_COVER_IMAGE, DELETE_COVER_IMAGE } from '../../constants/ModalTypes';

import { DeleteUserCoverMutation } from '../../mutations';

class CoverImage extends Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    onCreate: PropTypes.func
  }

  static defaultProps = {
    height: 200,
    width: 200,
    onClick: function() {},
    onDelete: function() {},
    onCreate: function() {}
  }

  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissCoverImageForm = this._dismissCoverImageForm.bind(this);
    this.state = {
      height: props.height,
      width: props.width,
      showCoverImageForm: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.props.coverImage.id);
  }

  _onItemTouchTap(value) {
    switch (value) {
        case CHANGE_COVER_IMAGE:
          this.setState({
            showCoverImageForm: true
          });
          break;
        case DELETE_COVER_IMAGE:
            this.props.onDelete(this.props.coverImage.id);
            Relay.Store.commitUpdate(
              new DeleteUserCoverMutation({coverImage: this.props.coverImage, user: this.props.user})
            );
          break;
      default:
    }
  }

  _dismissCoverImageForm() {
    this.setState({
      showCoverImageForm: false
    });
  }

  render() {
    let uri = '';
    if (this.props.coverImage) {
      uri = this.props.coverImage.uri;
    }
    return (
      <div className="CoverImage-container">
        <ModalableImage src={uri} height={this.state.height} width={this.state.width} sheetOptions={CoverImageSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
        <CoverImageFormDialog isVisible={this.state.showCoverImageForm} user={this.props.user} onCancel={this._dismissCoverImageForm} onCreate={this.props.onCreate} />
      </div>
    );
  }
}

export default Relay.createContainer(CoverImage, {
  fragments: {
    coverImage: () => Relay.QL`
      fragment on File {
        id
        uri
        ${DeleteUserCoverMutation.getFragment('coverImage')},
      }
    `,
    user: () => Relay.QL`
      fragment on User {
        id
        ${CoverImageFormDialog.getFragment('user')},
        ${DeleteUserCoverMutation.getFragment('user')},
      }
    `,
  },
});
