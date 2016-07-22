/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Button, Glyphicon, OverlayTrigger, Tooltip} = require('react-bootstrap');
const Message = require('../../MapStore2/web/client/components/I18N/Message');

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
            <div id="side-button" className="default">
                <OverlayTrigger placement="right" overlay={(<Tooltip id="sidePanelBtnTooltip"><Message msgId="lhtac.sideBtnTooltip"/></Tooltip>)}>
                <Button className="square-button" bsStyle="primary"
                onClick={() => this.props.toggleSidePanel(false )}><Glyphicon glyph="expand"/></Button>
            </OverlayTrigger>

            </div>
            ) :
        null;
    }
});

module.exports = SidePanelBtn;

