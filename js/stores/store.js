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
const layers = require('../../MapStore2/web/client/reducers/layers');
const map = mapConfigHistory(require('../../MapStore2/web/client/reducers/map'));

const LayersUtils = require('../../MapStore2/web/client/utils/LayersUtils');

const lhtac = require('../reducers/lhtac');

const assign = require('object-assign');

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
        lhtac: () => {return {}; },
        queryform: require('../../MapStore2/web/client/reducers/queryform'),
        ...pluginsReducers
    });

    const rootReducer = (state = null, action) => {
        let mapState = createHistory(LayersUtils.splitMapAndLayers(mapConfig(state, action)));

        let mapLayers = mapState ? layers(mapState.layers, action) : null;

        let contextLayers;
        if (mapLayers && mapLayers.flat) {
            contextLayers = (mapLayers.flat.filter((layer) => layer.hasOwnProperty('active')) || [null]);
        }

        let lhtacState = lhtac(state.lhtac, action);

        if (contextLayers) {
            let activeLayer = (contextLayers.filter((layer) => layer.hasOwnProperty('active') && layer.active === true) || [null])[0];
            lhtacState = assign({}, lhtacState, {contextLayers: contextLayers, activeLayer: activeLayer});
        }

        let newState = {
            ...allReducers(state, action),
            map: mapState && mapState.map ? map(mapState.map, action) : null,
            layers: mapLayers,
            mapInitialConfig: mapState ? mapState.mapInitialConfig : null,
            lhtac: lhtacState
        };

        return newState;
    };

    return DebugUtils.createDebugStore(rootReducer, {
        mousePosition: {enabled: false, crs: "EPSG:4326"},
        queryform: {
            searchUrl: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
            showDetailsPanel: false,
            useMapProjection: false,
            withContainer: false,
            spatialMethodOptions: [
                {id: "ZONE", name: "queryform.spatialfilter.methods.zone"}
            ],
            spatialOperations: [
                {id: "INTERSECTS", name: "queryform.spatialfilter.operations.intersects"}
            ],
            spatialField: {
                method: "ZONE",
                attribute: "geom3857",
                operation: "INTERSECTS",
                geometry: null,
                zoneFields: [{
                    id: 1,
                    url: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
                    typeName: "lhtac:itd_districts",
                    values: [],
                    value: null,
                    valueField: "properties.ITD_Dist_n",
                    textField: "properties.DistNum",
                    searchText: "*",
                    searchMethod: "ilike",
                    searchAttribute: "DistNum",
                    label: "ITD District",
                    multivalue: false,
                    sort: {
                        sortBy: "ITD_Dist_n",
                        sortOrder: "ASC"
                    }
                }, {
                    id: 2,
                    url: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
                    typeName: "lhtac:jurisdictions2014",
                    label: "Road Jurisdiction",
                    values: [],
                    value: null,
                    valueField: "properties.juris_code",
                    textField: "properties.name2",
                    searchText: "*",
                    searchMethod: "ilike",
                    searchAttribute: "name2",
                    disabled: true,
                    multivalue: true,
                    groupBy: "itd_dist",
                    dependson: {
                        id: 1,
                        field: "itd_dist",
                        value: null
                    }
                }]
            }
        }
    });
};
