'use strict';

import React, { PropTypes, Component } from 'react';
import { Dialog, FlatButton } from 'material-ui';
import styles from './ConfirmationDialog.css';

class ConfirmationDialog extends Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
  }

  static defaultProps = {
    title: '',
    message: '',
    isVisible: false,
    onCancel: function() {},
    onConfirm: function() {}
  }

  constructor(props) {
    super(props);

    this.state = {
      isVisible: props.isVisible
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps
    });
  }

  render() {

    return (
      <Dialog ref="dialog"
        title={this.props.title}
        open={this.state.isVisible}
        modal={false}>
        <div>
          <p>{this.props.message}</p>
          <div className="action-container">
            <FlatButton label="Cancel" secondary={true} onTouchTap={this.props.onCancel} />
            <FlatButton label="Yes" disabled={this.state.isDisabled} primary={true} onTouchTap={this.props.onConfirm} />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
