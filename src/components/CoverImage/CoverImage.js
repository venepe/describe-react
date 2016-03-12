'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CoverImage.css';
import ModalableImage from '../ModalableImage';
import CoverImageFormDialog from '../CoverImageFormDialog';
import SheetOptions from '../../constants/SheetOptions';
import { isClientID } from '../../utils/isClientID';

import ModalTypes, { CHANGE_COVER_IMAGE, DELETE_COVER_IMAGE } from '../../constants/ModalTypes';

import DeleteCoverImageMutation from '../../mutations/DeleteCoverImageMutation';
import DidDeleteCoverImageSubscription from '../../subscriptions/DidDeleteCoverImageSubscription';

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
              new DeleteCoverImageMutation({coverImage: this.props.coverImage, target: this.props.target})
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

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prevProps) {
    this.subscribe(prevProps);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe(prevProps = {}) {
    let coverImage = this.props.coverImage;
    if (!isClientID(coverImage.id)) {
      if (prevProps.coverImage && prevProps.coverImage.id !== coverImage.id) {
        this.unsubscribe();
        this.coverImageSubscription = Relay.Store.subscribe(
          new DidDeleteCoverImageSubscription({coverImage: coverImage, target: this.props.target})
        );
      } else {
        this.coverImageSubscription = Relay.Store.subscribe(
          new DidDeleteCoverImageSubscription({coverImage: coverImage, target: this.props.target})
        );
      }
    }
  }

  unsubscribe() {
    if (this.coverImageSubscription) {
      this.coverImageSubscription.dispose();
    }
  }

  render() {
    let uri = '';
    if (this.props.coverImage) {
      uri = this.props.coverImage.uri;
    }
    return (
      <div className="CoverImage-container">
        <ModalableImage src={uri} height={this.state.height} width={this.state.width} sheetOptions={SheetOptions.coverImageSheet} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
        <CoverImageFormDialog isVisible={this.state.showCoverImageForm} target={this.props.target} onCancel={this._dismissCoverImageForm} onCreate={this.props.onCreate} />
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
        ${DeleteCoverImageMutation.getFragment('coverImage')},
        ${DidDeleteCoverImageSubscription.getFragment('coverImage')},
      }
    `,
    target: () => Relay.QL`
      fragment on Node {
        ${CoverImageFormDialog.getFragment('target')},
        ${DeleteCoverImageMutation.getFragment('target')},
        ${DidDeleteCoverImageSubscription.getFragment('target')},
      }
    `,
  },
});
