'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import { IconButton, FontIcon, Styles } from 'material-ui';
import styles from './FulfillmentImage.css';
import ModalableImage from '../ModalableImage';
import TouchableImage from '../TouchableImage';
import { FulfillmentSheetOptions } from '../../constants/SheetOptions';
import ConfirmationDialog from '../ConfirmationDialog';
import { track, Events } from '../../utils/SMTIAnalytics';

import ModalTypes, { REJECT_FULFILLMENT } from '../../constants/ModalTypes';

import { UpdateFulfillmentMutation } from '../../mutations';
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
    this._onReject = this._onReject.bind(this);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._dismissConfirmationDialog = this._dismissConfirmationDialog.bind(this);
    this._pushMessages = this._pushMessages.bind(this);
    this.state = {
      height: props.height,
      width: props.width,
      showConfirmationDialog: false
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
            showConfirmationDialog: true
          });
          break;
      default:
    }
  }

  _dismissConfirmationDialog() {
    this.setState({
      showConfirmationDialog: false
    });
  }

  _onReject() {
    const status = 'REJECTED';
    this._dismissConfirmationDialog();
    Relay.Store.commitUpdate(
      new UpdateFulfillmentMutation({fulfillment: this.props.fulfillment, testCase: this.props.testCase, project: this.props.project, status})
    );

    //Start SMTIAnalytics
    track(Events.REJECTED_FULFILLMENT);
    //End SMTIAnalytics

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
          <div className="message">
            <IconButton style={{width: '24px', padding: '0px'}} onMouseUp={this._pushMessages} onTouchEnd={this._pushMessages}><FontIcon className="material-icons" color={Styles.Colors.grey600}>chat_bubble</FontIcon></IconButton>
          </div>
        </div>
      )
    } else {
      return (
        <div className="FulfillmentImage-container">
          <ModalableImage src={uri} height={this.state.height} width={this.state.width} sheetOptions={FulfillmentSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
          <ConfirmationDialog isVisible={this.state.showConfirmationDialog} title={'Reject Fulfillment?'} message={'Do you wish to continue?'} onCancel={this._dismissConfirmationDialog} onConfirm={this._onReject} />
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
        ${UpdateFulfillmentMutation.getFragment('fulfillment')},
        ${DidUpdateFulfillmentSubscription.getFragment('fulfillment')},
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        id
        ${UpdateFulfillmentMutation.getFragment('testCase')},
        ${DidUpdateFulfillmentSubscription.getFragment('testCase')},
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${UpdateFulfillmentMutation.getFragment('project')},
      }
    `,
  },
});
