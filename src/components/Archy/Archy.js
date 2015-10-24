'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './Archy.css';
import uuid from 'node-uuid';
import { Paper } from 'material-ui';

function getUUID() {
  return uuid.v4();
}

class Archy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      archible: props.archible
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('will receive props');
    this.setState({
      archible: nextProps.archible
    });
  }

  render() {

    function getLabel(node, isLast, index) {
      var nodes = node.nodes;
      var componentView;
      if (index === undefined) { index = 0 }

      if (nodes) {
        var rows = nodes.map(function(node, ix) {
          var last = ix === nodes.length - 1;
          var more = node.nodes && node.nodes.length;
          return getLabel(node, last, ix);
        });
      }
      var view;
      var uuidKey = node.key || index;

      if (isLast === undefined) {
        view =(
            <div>
              {node.component}
              <ul key={uuidKey}>
                {rows}
              </ul>
            </div>
        );
      } else {
        view = (
            <li key={uuidKey}>
              <div className="archy">
                {node.component}
              </div>
              <ul>
                {rows}
              </ul>
            </li>
        );
      }

      return view;
    }

    var view = getLabel(this.state.archible);

    return (
      <div>
        {view}
      </div>
    );
  }
}


Archy.propTypes = {archible: PropTypes.object};
Archy.defaultProps = {archible: {}};

export default Archy;
