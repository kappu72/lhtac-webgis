/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const {SplitButton, MenuItem} = require('react-bootstrap');
const mapUtils = require('../../MapStore2/web/client/utils/MapUtils');

const ContextSwitch = React.createClass({
    propTypes: {
        style: React.PropTypes.object,
        activeLayer: React.PropTypes.object,
        contextLayers: React.PropTypes.array,
        dropup: React.PropTypes.bool,
        mapInitialConfig: React.PropTypes.object,
        mapConfig: React.PropTypes.object,
        switchLayer: React.PropTypes.func,
        resetZones: React.PropTypes.func,
        changeMapView: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            style: {},
            mapInitialConfig: {},
            dropup: true,
            mapConfig: {},
            activeLayer: {},
            contextLayers: [],
            switchLayer: () => {},
            resetZones: () => {},
            changeMapView: () => {}
        };
    },
    renderMenuItem(activeLayer) {
        return (
            <MenuItem key={activeLayer.id} eventKey={activeLayer.id}>{activeLayer.title}</MenuItem>
        );
    },
    render() {
        return this.props.contextLayers && this.props.contextLayers.length > 0 ? (
            <div id="lhtacswitch">
                <label>Switch context layer</label>
                <br/>
                <SplitButton
                    id="lhtacswitchButton"
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
        this.zoomToInitialExtent();
    },
    zoomToInitialExtent() {
        // zooming to the initial extent based on initial map configuration
        let mapConfig = this.props.mapInitialConfig;
        let bbox = mapUtils.getBbox(mapConfig.center, mapConfig.zoom, this.props.mapConfig.size);
        this.props.changeMapView(mapConfig.center, mapConfig.zoom, bbox, this.props.mapConfig.size, null, mapConfig.projection);
    }
});

module.exports = ContextSwitch;
