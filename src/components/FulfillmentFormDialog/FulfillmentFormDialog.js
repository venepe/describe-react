'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentFormDialog.css';
import FulfillmentForm from '../FulfillmentForm';

class FulfillmentFormDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== undefined) {
      this.setState({
        isVisible: nextProps.isVisible
      });
    }
  }

  render() {
    return (
      <div>
        <FulfillmentForm testCase={this.props.testCase} isOpen={this.state.isVisible} onCancel={this.props.onCancel} />
      </div>
    );
  }
}

FulfillmentFormDialog.propTypes = {isVisible: PropTypes.bool, onCancel: PropTypes.func};
FulfillmentFormDialog.defaultProps = {isVisible: false, onCancel: function() {}};

var FulfillmentFormDialogContainer = Relay.createContainer(FulfillmentFormDialog, {
  fragments: {
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${FulfillmentForm.getFragment('testCase')}
      }
    `,
  },
});

export default FulfillmentFormDialogContainer;
