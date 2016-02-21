'use strict';

import React, { Component } from 'react';
import { FlatButton } from 'material-ui';
import styles from './HomeView.css';
import RegisterFormDialog from '../RegisterFormDialog';

class HomeView extends Component {
    constructor(props, context) {
        super(props);
        this.router = context.router;
        this._onRegister = this._onRegister.bind(this);
        this._showRegister = this._showRegister.bind(this);
    }

    _showRegister() {
      this.refs.registerFormDialog.show();
    }

    _onRegister() {
      this.refs.registerFormDialog.dismiss();
      this.router.push('/myprojects');
    }

    render() {

        return (
          <div>
            <div className="HomeView-container">
              <div className="introduce-label">
                Introducing Describe
                <div>
                  <div className="your-label">
                    Your dreams. Your goals. Your life.
                      <div className="describe-label">
                        Describe to get it done.
                      </div>
                  </div>
                  <FlatButton primary={true} label={"Sign Up Today"} onMouseUp={this._showRegister} onTouchEnd={this._showRegister} />
                </div>
              </div>
            </div>
            <RegisterFormDialog ref="registerFormDialog" onRegister={this._onRegister} />
            </div>
            );
    }
}

HomeView.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default HomeView;
