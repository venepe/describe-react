'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './CoverImageFormDialog.css';
import CoverImageForm from '../CoverImageForm';

class CoverImageFormDialog extends Component {
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
      <CoverImageForm user={this.props.user} isOpen={this.state.isVisible} onCancel={this.props.onCancel} onCreate={this.props.onCreate} />
    );
  }
}

export default Relay.createContainer(CoverImageFormDialog, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${CoverImageForm.getFragment('user')}
      }
    `,
  },
});
