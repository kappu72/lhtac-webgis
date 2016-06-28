/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const DebugUtils = require('../../MapStore2/web/client/utils/DebugUtils');
const PluginsUtils = require('../../MapStore2/web/client/utils/PluginsUtils');
const {combineReducers} = require('redux');

const {mapConfigHistory, createHistory} = require('../../MapStore2/web/client/utils/MapHistoryUtils');

const mapConfig = require('../../MapStore2/web/client/reducers/config');
const layers = require('../reducers/layers');
const map = mapConfigHistory(require('../../MapStore2/web/client/reducers/map'));

const LayersUtils = require('../../MapStore2/web/client/utils/LayersUtils');

module.exports = (plugins) => {
    const pluginsReducers = PluginsUtils.getReducers(plugins);

    const allReducers = combineReducers({
        browser: require('../../MapStore2/web/client/reducers/browser'),
        locale: require('../../MapStore2/web/client/reducers/locale'),
        map: () => {return null; },
        layers: () => {return null; },
        controls: require('../../MapStore2/web/client/reducers/controls'),
        help: require('../../MapStore2/web/client/reducers/help'),
        sidepanel: require('../reducers/sidepanel'),
        mapInitialConfig: () => {return null; },
        queryform: require('../reducers/queryform'),
        advancedfilter: require('../reducers/advancedfilter'),
        ...pluginsReducers,
        draw: require('../reducers/draw'),
        highlight: require('../reducers/highlight')

    });

    const rootReducer = (state = null, action) => {
        let mapState = createHistory(LayersUtils.splitMapAndLayers(mapConfig(state, action)));

        let mapLayers = mapState ? layers(mapState.layers, action) : null;

        let newState = {
            ...allReducers(state, action),
            map: mapState && mapState.map ? map(mapState.map, action) : null,
            layers: mapLayers,
            mapInitialConfig: mapState ? mapState.mapInitialConfig : null
        };

        return newState;
    };

    return DebugUtils.createDebugStore(rootReducer, {
        mousePosition: {enabled: false, crs: "EPSG:4326"}
    });
};
