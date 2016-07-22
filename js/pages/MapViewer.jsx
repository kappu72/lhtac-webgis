/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const {connect} = require('react-redux');
const {createSelector} = require('reselect');

const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');

const {resetControls} = require('../../MapStore2/web/client/actions/controls');

const {toggleSidePanel, pinSidePanel, resizeHeight} = require("../actions/sidepanel");

const PluginsContainer = connect((state) => ({
    pluginsState: state && state.controls || {}
}))(require('../../MapStore2/web/client/components/plugins/PluginsContainer'));

const SidePanel = connect((state) => ({
    expanded: state.sidepanel.expanded,
    pinned: state.sidepanel.pinned,
    height: state.sidepanel.layoutUpdates.style.height
}), {
    onToggle: toggleSidePanel,
    onPin: pinSidePanel
})(require("../containers/SidePanel"));

const SouthPanel = connect((state) => ({
    initHeight: 100 - parseFloat(state.sidepanel.layoutUpdates.style.height),
    height: 100 - parseFloat(state.sidepanel.layoutUpdates.style.height)
}), {
    resizeHeight
})(require("../containers/SouthPanel"));

const {layersSelector} = require('../../MapStore2/web/client/selectors/layers');


const selector = createSelector([layersSelector, (state) => (state.sidepanel.expanded)], (layers, expanded) => ({
    loading: layers && layers.some((layer) => layer.loading),
    show: !expanded
}));
const SidePanelBtn = connect(selector, {
    toggleSidePanel
})(require('../components/SidePanelBtn'));

const MapViewer = React.createClass({
    propTypes: {
        mode: React.PropTypes.string,
        params: React.PropTypes.object,
        reset: React.PropTypes.func,
        plugins: React.PropTypes.object,
        pluginsConfig: React.PropTypes.object,
        mapType: React.PropTypes.string,
        style: React.PropTypes.object,
        layoutUpdates: React.PropTypes.object,
        toggleControl: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            mode: 'desktop',
            toggleControl: () => {},
            layoutUpdates: {},
            mapType: "leaflet",
            style: {
                position: "absolute",
                top: 0,
                left: "450px",
                right: 0,
                height: "100%"
            }

        };
    },
    componentWillReceiveProps(nextProps) {
        this.pluginsConfig = {};
        this.pluginsConfig[nextProps.mode] = nextProps.pluginsConfig[nextProps.mode].map((Plugin) => {
            let newPlug = Plugin;
            if (Plugin.name === "Map") {
                let config = Plugin.cfg;
                config = {...config, options: {resize: nextProps.layoutUpdates.resize}};
                newPlug = {...Plugin, cfg: config};
            }
            return newPlug;
        });
    },
    render() {
        if (this.props.pluginsConfig) {
            return (
                <div>
                    <SidePanel/>
                    <PluginsContainer key="viewer" id="viewer"
                        style={this.props.layoutUpdates.style || this.props.style}
                        plugins={this.props.plugins}
                        params={this.props.params}
                        pluginsConfig={this.pluginsConfig || this.props.pluginsConfig}
                        mode={this.props.mode}
                    />
                    <div id="left-edge" onMouseEnter={() => { this.tooglePanel(false); }} onMouseLeave={() => { if (this.timeOut) { clearTimeout(this.timeOut); } }}/>
                    <SouthPanel />
                    <SidePanelBtn />
                </div>
            );
        }
        return null;
    },
    tooglePanel(status) {
        this.timeOut = setTimeout(this.props.toggleControl, 1000, status);
    },
    timeOut: null
});

module.exports = connect((state) => ({
    pluginsConfig: state.plugins || ConfigUtils.getConfigProp('plugins') || null,
    layoutUpdates: state.sidepanel.layoutUpdates || 0,
    height: ( state.featureselector && state.featureselector.features && state.featureselector.features.length > 0 ) ? state.sidepanel.layoutUpdates.style.height : "100%"
}),
{
    toggleControl: toggleSidePanel,
    reset: resetControls
})(MapViewer);
