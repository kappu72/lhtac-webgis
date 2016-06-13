/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const {connect} = require('react-redux');

const assign = require('object-assign');

const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');
const PluginsUtils = require('../../MapStore2/web/client/utils/PluginsUtils');

const {resetControls} = require('../../MapStore2/web/client/actions/controls');

const {toggleSidePanel, pinSidePanel, resizeHeight} = require("../actions/sidepanel");

const SidePanel = connect((state) => ({
    expanded: state.sidepanel.expanded,
    pinned: state.sidepanel.pinned,
    height: ( state.featureselector && state.featureselector.features && state.featureselector.features.length > 0 ) ? state.sidepanel.layoutUpdates.style.height : "100%"
}), {
    onToggle: toggleSidePanel,
    onPin: pinSidePanel
})(require("../containers/SidePanel"));

const SouthPanel = connect((state) => ({
    initHeight: (state.featureselector.features.length > 0 ) ? 100 - parseFloat(state.sidepanel.layoutUpdates.style.height) : 0,
    height: (state.featureselector.features.length > 0 ) ? 100 - parseFloat(state.sidepanel.layoutUpdates.style.height) : 0
}), {
    resizeHeight
})(require("../containers/SouthPanel"));

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
        toggleControl: React.PropTypes.func,
        height: React.PropTypes.string
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
                left: "350px",
                right: 0
            },
            height: "80%"
        };
    },
    getPluginDescriptor(plugin) {
        return PluginsUtils.getPluginDescriptor(this.props.plugins,
                this.props.pluginsConfig[this.props.mode], plugin);
    },
    getStyle(style) {
        let newStyle = {...style, height: this.props.height};
        return newStyle;
    },
    renderPlugins(plugins) {
        return plugins
            .filter((Plugin) => !Plugin.hide)
            .map(this.getPluginDescriptor)
            .map((Plugin) => {
                let config = Plugin.cfg;
                let params = assign({}, this.props.params, {mapType: this.props.mapType});
                if (Plugin.name === "Map") {
                    config = assign({}, config, {options: {resize: this.props.layoutUpdates.resize}});
                }

                return <Plugin.impl key={Plugin.name} {...params} {...config} items={Plugin.items}/>;
            });
    },
    render() {
        if (this.props.pluginsConfig) {
            return (
                <div>
                    <SidePanel/>
                    <div key="viewer" style={this.getStyle(this.props.layoutUpdates.style || this.props.style)}>
                        {this.renderPlugins(this.props.pluginsConfig[this.props.mode])}
                    </div>
                    <div id="left-edge" onMouseEnter={() => { this.tooglePanel(false); }} onMouseLeave={() => { if (this.timeOut) { clearTimeout(this.timeOut); } }}/>
                    <SouthPanel />
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
