'use strict';

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './UserView.css';
import { Paper } from 'material-ui';
import FileImage from '../FileImage';
import SMTIToolbar from '../SMTIToolbar';
import Divider from 'material-ui/lib/divider';

class UserView extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this._pushCoverImage = this._pushCoverImage.bind(this);
  }

  _pushCoverImage(fileId) {
    let userId = this.props.user.id;
    this.router.push(`/users/${userId}/files/${fileId}`);
  }

  render() {
    if (this.props.user) {
      let fullName = this.props.user.fullName || ' ';
      let summary = this.props.user.summary || 'No summary';

      return (
        <div className="UserView-container">
          <SMTIToolbar title={this.props.user.name} />
          <FileImage file={this.props.user.cover} height={400} width={null} onClick={this._pushCoverImage}/>
          <div className="user-container">
            <div className="name">{this.props.user.name}</div>
            <div className="full-name">{fullName}</div>
            <Divider />
            <div className="label">Summary</div>
            <div className="summary">{summary}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}

export default Relay.createContainer(UserView, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        name
        email
        fullName
        summary
        cover {
          ${FileImage.getFragment('file')},
        }
      }
    `,
  },
});
