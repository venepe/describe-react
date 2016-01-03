'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentForm.css';
import {track, Events} from '../../utils/SMTIAnalytics';

import IntroduceFulfillmentMutation from '../../mutations/IntroduceFulfillmentMutation';

class FulfillmentForm extends Component {
  constructor(props) {
    super(props);
    this._onCancel = this._onCancel.bind(this);
    this._onCreate = this._onCreate.bind(this);
  }

  _onCreate(e) {
    if (e.target.files.length > 0) {
      let uri = e.target.files[0];
      Relay.Store.update(
        new IntroduceFulfillmentMutation({uri, testCase: this.props.testCase})
      );
      //Start SMTIAnalytics
      track(Events.FULFILLED_TEST_CASE);
      //End SMTIAnalytics
    }
  }

  _onCancel() {
    this.props.onCancel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen === true) {
      this._fileUpload.click();
      this.props.onCancel();
    }
  }

  render() {
    return (
        <input
        ref={(c) => this._fileUpload = c}
        type="file"
        style={{"display" : "none"}}
        onChange={this._onCreate}/>
    );
  }
}

FulfillmentForm.propTypes = {onCancel: PropTypes.func, isOpen: PropTypes.bool};
FulfillmentForm.defaultProps = {onCancel: function() {}, isOpen: false};

var FulfillmentFormContainer = Relay.createContainer(FulfillmentForm, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${IntroduceFulfillmentMutation.getFragment('testCase')}
      }
    `,
  },
});

export default FulfillmentFormContainer;