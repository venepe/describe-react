'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentImage.css';
import ModalableImage from '../ModalableImage';
import SheetOptions from '../../constants/SheetOptions';

import ModalTypes, { DELETE_FULFILLMENT } from '../../constants/ModalTypes';

import DeleteFulfillmentMutation from '../../mutations/DeleteFulfillmentMutation';

class FulfillmentImage extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this.state = {
      height: props.height,
      width: props.width
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  _onClick() {
    this.props.onClick(this.props.fulfillment.id);
  }

  _onItemTouchTap(value) {
    switch (value) {
        case DELETE_FULFILLMENT:
            this.props.onDelete(this.props.fulfillment.id);
            Relay.Store.update(
              new DeleteFulfillmentMutation({fulfillment: this.props.fulfillment, testCase: this.props.testCase})
            );
          break;
      default:
    }
  }

  render() {
    let uri = '';
    if (this.props.fulfillment) {
      uri = this.props.fulfillment.uri;
    }
    return (
      <div className="FulfillmentImage-container">
        <ModalableImage src={uri} height={this.state.height} width={this.state.width} sheetOptions={SheetOptions.fulfillmentSheet} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
      </div>
    );
  }
}

FulfillmentImage.propTypes = {height: PropTypes.number, width: PropTypes.number, onClick: PropTypes.func, onDelete: PropTypes.func};
FulfillmentImage.defaultProps = {height: 200, width: 200, onClick: function() {}, onDelete: function() {}};

var FulfillmentImageContainer = Relay.createContainer(FulfillmentImage, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on File {
        id
        uri
        ${DeleteFulfillmentMutation.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${DeleteFulfillmentMutation.getFragment('testCase')},
      }
    `,
  },
});

module.exports = FulfillmentImageContainer;
