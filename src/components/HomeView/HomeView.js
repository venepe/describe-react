'use strict';

import React, { Component } from 'react';
import { FlatButton } from 'material-ui';
import styles from './HomeView.css';
import RegisterFormDialog from '../RegisterFormDialog';

class HomeView extends Component {
    constructor(props) {
        super(props);
        this._onRegister = this._onRegister.bind(this);
        this._showRegister = this._showRegister.bind(this);
    }

    _showRegister() {
      this.refs.registerFormDialog.show();
    }

    _onRegister() {
      this.refs.registerFormDialog.dismiss();
      this.props.history.pushState(null, '/myprojects');
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

export default HomeView;
