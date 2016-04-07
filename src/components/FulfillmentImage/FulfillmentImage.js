'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentImage.css';
import ModalableImage from '../ModalableImage';
import { FulfillmentSheetOptions } from '../../constants/SheetOptions';

import ModalTypes, { REJECT_FULFILLMENT } from '../../constants/ModalTypes';

import { RejectFulfillmentMutation } from '../../mutations';
import { registerDidRejectFulfillment } from '../../stores/SubscriptionStore';
import { DidRejectFulfillmentSubscription } from '../../subscriptions';

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
        case REJECT_FULFILLMENT:
            this.props.onDelete(this.props.fulfillment.id);
            Relay.Store.commitUpdate(
              new RejectFulfillmentMutation({fulfillment: this.props.fulfillment, testCase: this.props.testCase, project: this.props.project})
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
    if (this.props.fulfillment && this.props.testCase) {
      let fulfillment = this.props.fulfillment;
      let testCase = this.props.testCase;
      let fulfillmentId = fulfillment.id;
      let testCaseId = testCase.id;

      registerDidRejectFulfillment({fulfillmentId, testCaseId}, () => {
        return Relay.Store.subscribe(
          new DidRejectFulfillmentSubscription({fulfillment, testCase})
        );
      });
    }
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
        ${RejectFulfillmentMutation.getFragment('fulfillment')},
        ${DidRejectFulfillmentSubscription.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        ${RejectFulfillmentMutation.getFragment('testCase')},
        ${DidRejectFulfillmentSubscription.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${RejectFulfillmentMutation.getFragment('project')},
      }
    `,
  },
});
