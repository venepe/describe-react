'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { IconButton, FontIcon, Styles } from 'material-ui';
import styles from './FulfillmentImage.css';
import ModalableImage from '../ModalableImage';
import TouchableImage from '../TouchableImage';
import { FulfillmentSheetOptions } from '../../constants/SheetOptions';
import RejectionFormDialog from '../RejectionFormDialog';

import ModalTypes, { REJECT_FULFILLMENT } from '../../constants/ModalTypes';

import { registerDidUpdateFulfillment } from '../../stores/SubscriptionStore';
import { DidUpdateFulfillmentSubscription } from '../../subscriptions';

class FulfillmentImage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

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

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._onClick = this._onClick.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissRejectionForm = this._dismissRejectionForm.bind(this);
    this._pushMessages = this._pushMessages.bind(this);
    this.state = {
      height: props.height,
      width: props.width,
      showRejectionForm: false
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
          this.setState({
            showRejectionForm: true
          });
          break;
      default:
    }
  }

  _dismissRejectionForm() {
    this.setState({
      showRejectionForm: false
    });
  }

  _pushMessages() {
    let channelId = this.props.fulfillment.file.id;
    this.router.push(`/channels/${channelId}/messages`);
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

      registerDidUpdateFulfillment({fulfillmentId, testCaseId}, () => {
        console.log('registerDidUpdateFulfillment');
        return Relay.Store.subscribe(
          new DidUpdateFulfillmentSubscription({fulfillment, testCase})
        );
      });
    }
  }

  render() {
    let uri = '';
    if (this.props.fulfillment) {
      uri = this.props.fulfillment.file.uri;
    }
    if (this.props.fulfillment.status === 'REJECTED') {
      return (
        <div className="FulfillmentImage-container">
          <TouchableImage src={uri} height={this.state.height} width={this.state.width} onClick={this._onClick} />
        </div>
      )
    } else {
      return (
        <div className="FulfillmentImage-container">
          <ModalableImage src={uri} height={this.state.height} width={this.state.width} sheetOptions={FulfillmentSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
          <RejectionFormDialog isVisible={this.state.showRejectionForm} fulfillment={this.props.fulfillment} testCase={this.props.testCase} project={this.props.project} onCancel={this._dismissRejectionForm} onCreate={this._dismissRejectionForm} />
          <div className="message">
            <IconButton style={{width: '24px', padding: '0px'}} onMouseUp={this._pushMessages} onTouchEnd={this._pushMessages}><FontIcon className="material-icons" color={Styles.Colors.grey600}>chat_bubble</FontIcon></IconButton>
          </div>
        </div>
      );
    }
  }
}

export default Relay.createContainer(FulfillmentImage, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on Fulfillment {
        id
        status
        file {
          id
          uri
        }
        ${RejectionFormDialog.getFragment('fulfillment')},
        ${DidUpdateFulfillmentSubscription.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        ${RejectionFormDialog.getFragment('testCase')},
        ${DidUpdateFulfillmentSubscription.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${RejectionFormDialog.getFragment('project')},
      }
    `,
  },
});
