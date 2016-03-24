'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ExampleImage.css';
import ModalableImage from '../ModalableImage';
import { ExampleSheetOptions } from '../../constants/SheetOptions';

import ModalTypes, { DELETE_EXAMPLE } from '../../constants/ModalTypes';

import { DeleteExampleMutation } from '../../mutations';
import { registerDidDeleteExample } from '../../stores/SubscriptionStore';
import { DidDeleteExampleSubscription } from '../../subscriptions';

class ExampleImage extends Component {
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
    this.props.onClick(this.props.example.id);
  }

  _onItemTouchTap(value) {
    switch (value) {
        case DELETE_EXAMPLE:
            this.props.onDelete(this.props.example.id);
            Relay.Store.commitUpdate(
              new DeleteExampleMutation({example: this.props.example, target: this.props.target})
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
    let example = this.props.example;
    let target = this.props.target;
    registerDidDeleteExample({example, target}, () => {
      return Relay.Store.subscribe(
        new DidDeleteExampleSubscription({example, target})
      );
    });
  }

  render() {
    let uri = '';
    if (this.props.example) {
      uri = this.props.example.uri;
    }
    return (
      <div className="ExampleImage-container">
        <ModalableImage src={uri} height={this.state.height} width={this.state.width} sheetOptions={ExampleSheetOptions} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
      </div>
    );
  }
}

export default Relay.createContainer(ExampleImage, {
  fragments: {
    example: () => Relay.QL`
      fragment on File {
        id
        uri
        ${DeleteExampleMutation.getFragment('example')},
        ${DidDeleteExampleSubscription.getFragment('example')},
      }
    `,
    target: () => Relay.QL`
      fragment on Node {
        id
        ${DeleteExampleMutation.getFragment('target')},
        ${DidDeleteExampleSubscription.getFragment('target')},
      }
    `,
  },
});
