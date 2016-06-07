'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './FulfillmentFormDialog.css';
import FulfillmentForm from '../FulfillmentForm';

class FulfillmentFormDialog extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func
  }

  static defaultProps = {
    isVisible: false,
    onCancel: function() {}
  }

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
        <FulfillmentForm fulfillment={this.props.fulfillment} testCase={this.props.testCase} project={this.props.project} isOpen={this.state.isVisible} onCancel={this.props.onCancel} />
      </div>
    );
  }
}

export default Relay.createContainer(FulfillmentFormDialog, {
  fragments: {
    fulfillment: () => Relay.QL`
      fragment on Fulfillment {
        ${FulfillmentForm.getFragment('fulfillment')}
      }
    `,
    testCase: () => Relay.QL`
      fragment on TestCase {
        ${FulfillmentForm.getFragment('testCase')}
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${FulfillmentForm.getFragment('project')},
      }
    `,
  },
});
