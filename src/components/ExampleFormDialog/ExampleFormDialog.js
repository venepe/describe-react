'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ExampleFormDialog.css';
import ExampleForm from '../ExampleForm';

class ExampleFormDialog extends Component {
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
      <ExampleForm target={this.props.target} isOpen={this.state.isVisible} onCancel={this.props.onCancel} />
    );
  }
}

ExampleFormDialog.propTypes = {isVisible: PropTypes.bool, onCancel: PropTypes.func};
ExampleFormDialog.defaultProps = {isVisible: false, onCancel: function() {}};

var ExampleFormDialogContainer = Relay.createContainer(ExampleFormDialog, {
  fragments: {
    target: () => Relay.QL`
      fragment on Node {
        ${ExampleForm.getFragment('target')}
      }
    `,
  },
});

export default ExampleFormDialogContainer;
