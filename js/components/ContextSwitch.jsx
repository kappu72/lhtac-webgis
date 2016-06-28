/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const {SplitButton, MenuItem} = require('react-bootstrap');

const ContextSwitch = React.createClass({
    propTypes: {
        style: React.PropTypes.object,
        activeLayer: React.PropTypes.object,
        contextLayers: React.PropTypes.array,
        dropup: React.PropTypes.bool,
        switchLayer: React.PropTypes.func,
        resetZones: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            style: {},
            dropup: true,
            activeLayer: {},
            contextLayers: [],
            switchLayer: () => {},
            resetZones: () => {}
        };
    },
    renderMenuItem(activeLayer) {
        return (
            <MenuItem key={activeLayer.id} eventKey={activeLayer.id}>{activeLayer.title}</MenuItem>
        );
    },
    render() {
        return this.props.contextLayers && this.props.contextLayers.length > 0 ? (
            <div>
                <label>Switch context layer</label>
                <br/>
                <SplitButton
                    id="splitbutton"
                    title={this.props.activeLayer.title}
                    pullRight={false}
                    dropup={this.props.dropup}
                    onSelect={this.changeContext}>
                    {this.props.contextLayers.map(this.renderMenuItem)}
                </SplitButton>
                <br/>
                <br/>
            </div>
        ) : (
            <span/>
        );
    },
    changeContext(event, eventKey) {
        this.props.resetZones();
        this.props.switchLayer(this.props.contextLayers.filter((l) => {return l.id === eventKey; })[0]);
    }
});

module.exports = ContextSwitch;
