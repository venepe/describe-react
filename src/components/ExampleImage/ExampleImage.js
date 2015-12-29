'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ExampleImage.css';
import ModalableImage from '../ModalableImage';
import SheetOptions from '../../constants/SheetOptions';

import ModalTypes, { DELETE_EXAMPLE } from '../../constants/ModalTypes';

import DeleteExampleMutation from '../../mutations/DeleteExampleMutation';

class ExampleImage extends Component {
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
            Relay.Store.update(
              new DeleteExampleMutation({example: this.props.example, target: this.props.target})
            );
          break;
      default:
    }
  }

  render() {

    return (
      <div className="ExampleImage-container">
        <ModalableImage src={this.props.example.uri} height={this.state.height} width={this.state.width} sheetOptions={SheetOptions.exampleSheet} onItemTouchTap={this._onItemTouchTap} onClick={this._onClick} />
      </div>
    );
  }
}

ExampleImage.propTypes = {height: PropTypes.number, width: PropTypes.number, onClick: PropTypes.func, onDelete: PropTypes.func};
ExampleImage.defaultProps = {height: 200, width: 200, onClick: function() {}, onDelete: function() {}};

var ExampleImageContainer = Relay.createContainer(ExampleImage, {
  fragments: {
    example: () => Relay.QL`
      fragment on File {
        id
        uri
        ${DeleteExampleMutation.getFragment('example')},
      }
    `,
    target: () => Relay.QL`
      fragment on Node {
        ${DeleteExampleMutation.getFragment('target')},
      }
    `,
  },
});

module.exports = ExampleImageContainer;
