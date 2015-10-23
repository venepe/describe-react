'use strict';

import React, { Component } from 'react';
import Paper from 'material-ui/lib/paper';
import StylePropable from 'material-ui/lib/mixins/style-propable';
import _ from 'lodash';
import UI from '../../utils/UI';

class Panel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            paperStyle: this._getPaperStyle(),
            zDepth: this._getZDepth()
        };
        this._onResize = _.debounce(this._onResize, 150).bind(this);
    }

    _getPaperStyle() {
        let style = {
            minHeight: '350px',
            margin: '5px auto 0 auto',
            paddingBottom: '10px',
            backgroundColor: '#fff'
        };
        if (UI.windowWidth() <= UI.BREAK_POINT) {
            style.width = '100%';
        } else {
            style.width = UI.BREAK_POINT + 'px';
        }
        return style;
    }

    _getZDepth() {
        return UI.windowWidth() <= UI.BREAK_POINT ? 0 : 1;
    }

    _onResize(e) {
        this.setState({
            paperStyle: this._getPaperStyle(),
            zDepth: this._getZDepth()
        });
    }

    componentWillMount() {
        window.addEventListener('resize', this._onResize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize, false);
    }

    render() {
        let mergeAndPrefix = StylePropable.mergeAndPrefix;
        return (
            <Paper style={ mergeAndPrefix(this.state.paperStyle) } zDepth={ this.state.zDepth } rounded={ false }>
              { this.props.children }
            </Paper>
            );
    }
}

Panel.propTypes = {children: React.PropTypes.array};

export default Panel;
