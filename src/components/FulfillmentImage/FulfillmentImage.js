'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentImage.css';
import ModalableImage from '../ModalableImage';
import SheetOptions from '../../constants/SheetOptions';
import { isClientID } from '../../utils/isClientID';

import ModalTypes, { DELETE_FULFILLMENT } from '../../constants/ModalTypes';

import DeleteFulfillmentMutation from '../../mutations/DeleteFulfillmentMutation';
import DidDeleteFulfillmentSubscription from '../../subscriptions/DidDeleteFulfillmentSubscription';

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

  componentDidUpdate(prevProps) {
    this.subscribe(prevProps);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe(prevProps = {}) {
    if(!isClientID(this.props.fulfillment.id)) {
      if (prevProps.fulfillment !== undefined && prevProps.fulfillment.id !== this.props.fulfillment.id) {
        this.unsubscribe();
      }

      if (!this.fulfillmentSubscription) {
        this.fulfillmentSubscription = Relay.Store.subscribe(
          new DidDeleteFulfillmentSubscription({fulfillment: this.props.fulfillment, testCase: this.props.testCase})
        );
      }
    }
  }

  unsubscribe() {
    if (this.fulfillmentSubscription) {
      this.fulfillmentSubscription.dispose();
      this.fulfillmentSubscription = null;
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
