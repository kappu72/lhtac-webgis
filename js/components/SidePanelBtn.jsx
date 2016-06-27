/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Button, Glyphicon} = require('react-bootstrap');

const SidePanelBtn = React.createClass({
    propTypes: {
        show: React.PropTypes.bool,
        loading: React.PropTypes.bool,
        toggleSidePanel: React.PropTypes.func
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
        show: true,
        loading: false,
        toggleSidePanel: () => {}
        };
    },
    render() {
        return this.props.show ? (
            <div id="side-button" className={this.props.loading ? "loading" : "default"}>
                <Button bsSize="xsmall"
                onClick={() => this.props.toggleSidePanel(false)}><Glyphicon glyph="menu-hamburger"/></Button>
            </div>
            ) :
        null;
    }
});

module.exports = SidePanelBtn;

