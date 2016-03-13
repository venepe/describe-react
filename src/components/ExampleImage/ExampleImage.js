'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ExampleImage.css';
import ModalableImage from '../ModalableImage';
import SheetOptions from '../../constants/SheetOptions';
import { isClientID } from '../../utils/isClientID';

import ModalTypes, { DELETE_EXAMPLE } from '../../constants/ModalTypes';

import DeleteExampleMutation from '../../mutations/DeleteExampleMutation';
import DidDeleteExampleSubscription from '../../subscriptions/DidDeleteExampleSubscription';

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

  componentDidUpdate(prevProps) {
    this.subscribe(prevProps);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe(prevProps = {}) {
    if(!isClientID(this.props.example.id)) {
      if (prevProps.example !== undefined && prevProps.example.id !== this.props.example.id) {
        this.unsubscribe();
      }

      if (!this.exampleSubscription) {
        this.exampleSubscription = Relay.Store.subscribe(
          new DidDeleteExampleSubscription({example: this.props.example, target: this.props.target})
        );
      }
    }
  }

  unsubscribe() {
    if (this.exampleSubscription) {
      this.exampleSubscription.dispose();
      this.exampleSubscription = null;
    }
  }


  render() {
    let uri = '';
    if (this.props.example) {
      uri = this.props.example.uri;
    }
    return (
      <div className="ExampleImage-container">
        <ModalableImage src={uri} height={this.state.height} width={this.state.width} sheetOptions={SheetOptions.exampleSheet} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
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
        ${DeleteExampleMutation.getFragment('target')},
        ${DidDeleteExampleSubscription.getFragment('target')},
      }
    `,
  },
});
