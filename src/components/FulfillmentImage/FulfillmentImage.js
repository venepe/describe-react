'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentImage.css';
import ModalableImage from '../ModalableImage';
import { FulfillmentSheetOptions } from '../../constants/SheetOptions';

import ModalTypes, { DELETE_FULFILLMENT } from '../../constants/ModalTypes';

import { DeleteFulfillmentMutation } from '../../mutations';
import { registerDidDeleteFulfillment } from '../../stores/SubscriptionStore';
import { DidDeleteFulfillmentSubscription } from '../../subscriptions';

class FulfillmentImage extends Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    height: 200,
    width: 200,
    onClick: function() {},
    onDelete: function() {}
  }

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
            Relay.Store.commitUpdate(
              new DeleteFulfillmentMutation({fulfillment: this.props.fulfillment, testCase: this.props.testCase, project: this.props.project})
            );
          break;
      default:
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    let fulfillment = this.props.fulfillment;
    let testCase = this.props.testCase;
    let fulfillmentId = fulfillment.id;
    let testCaseId = testCase.id;

    registerDidDeleteFulfillment({fulfillmentId, testCaseId}, () => {
      return Relay.Store.subscribe(
        new DidDeleteFulfillmentSubscription({fulfillment, testCase})
      );
    });
  }

  render() {
    let uri = '';
    if (this.props.fulfillment) {
      uri = this.props.fulfillment.uri;
    }
    return (
      <div className="FulfillmentImage-container">
        <ModalableImage src={uri} height={this.state.height} width={this.state.width} sheetOptions={FulfillmentSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
      </div>
    );
  }
}

export default Relay.createContainer(FulfillmentImage, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on File {
        id
        uri
        ${DeleteFulfillmentMutation.getFragment('fulfillment')},
        ${DidDeleteFulfillmentSubscription.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        ${DeleteFulfillmentMutation.getFragment('testCase')},
        ${DidDeleteFulfillmentSubscription.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${DeleteFulfillmentMutation.getFragment('project')},
      }
    `,
  },
});
