'use strict';

import React, { PropTypes, Component } from 'react';
import styles from './MyProjectsPlaceholder.css';

class MyProjectsPlaceholder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="map">
        <img src={'http://localhost:8000/assets/map-27749_1280.png'} width={120} height={120} />
        <div className="map-line1">You have no projects!</div>
        <div className="map-line2">Start one and get life done.</div>
      </div>
    );
  }
}

MyProjectsPlaceholder.propTypes = {text: PropTypes.string};
MyProjectsPlaceholder.defaultProps = {text: ''};

export default MyProjectsPlaceholder;
