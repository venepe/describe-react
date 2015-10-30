'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './PaperView.css';
import { Paper, Dialog } from 'material-ui';
import Archy from '../Archy';
import ArchyLabel from '../ArchyLabel';
import ModalableArchyLabel from '../ModalableArchyLabel';

import PaperUpdateFormDialog from '../PaperUpdateFormDialog';

import DeletePaperMutation from '../../mutations/DeletePaperMutation';

import EditPaperModal from '../EditPaperModal';

import ModalTypes, { UPDATE_PAPER, DELETE_PAPER } from '../../constants/ModalTypes';

class PaperView extends Component {
  constructor(props) {
    super(props);
    this._presentDialog = this._presentDialog.bind(this);
  }

  _presentDialog(dialogType, targetId, targetRelayObject) {
    switch (dialogType) {
        case UPDATE_PAPER:
            this.refs.paperUpdateFormDialog.show(targetId);
          break;
        case DELETE_PAPER:
            Relay.Store.update(
              new DeletePaperMutation({paper: paper, target: {id: null}})
            );
          break;
      default:

    }
  }

  render() {
    let object = {};
    if (this.props.paper) {
      object = {
        component: (<ArchyLabel text={'As described:'}/>),
        nodes: [
          {
            component: (<ModalableArchyLabel iconMenu={<EditPaperModal onItemTouchTap={this._presentDialog} id={this.props.paper.id} paper={this.props.paper} />} id={this.props.paper.id} text={this.props.paper.text}/>),
            nodes: []
          }
        ]
      }
    }

    return (
      <div className="PaperView-container">
        <Archy archible={object}/>
          <PaperUpdateFormDialog ref="paperUpdateFormDialog" />
      </div>
    );
  }
}

export default Relay.createContainer(PaperView, {
  fragments: {
    paper: () => Relay.QL`
      fragment on Paper {
        id
        text
        ${DeletePaperMutation.getFragment('paper')},
      }
    `,
  },
});
