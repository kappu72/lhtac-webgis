/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const axios = require('../../MapStore2/web/client/libs/ajax');

const SWITCH_LAYER = 'SWITCH_LAYER';
const SET_ACTIVE_ZONE = 'SET_ACTIVE_ZONE';
const CHANGE_LAYER_PROPERTIES = 'CHANGE_LAYER_PROPERTIES';
const STATS_LOADING = 'STATS_LOADING';
const CHANGE_DOWNLOAD_FORMAT = 'CHANGE_DOWNLOAD_FORMAT';

const {changeLayerProperties} = require('../../MapStore2/web/client/actions/layers');
const {zoneSearchError, zoneFilter, zoneSearch} = require('../../MapStore2/web/client/actions/queryform');
function switchLayer(layer) {
    return {
        type: SWITCH_LAYER,
        layer
    };
}
function setActiveZone(id, value, exclude) {
    return {
        type: SET_ACTIVE_ZONE,
        id,
        value,
        exclude
    };
}
function statsLoading(status) {
    return {
        type: "STATS_LOADING",
        status
    };
}

function changeLhtacLayerFilter(layer, properties, areaFilter) {
    let url = layer.url.replace('wms', 'ows');
    let params = {
        service: "WFS",
        request: "getFeature",
        version: "1.1.0",
        resultType: "hits",
        typeNames: layer.name
    };
    return (dispatch) => {
        dispatch(changeLayerProperties(layer.id, properties));
        dispatch(statsLoading(true));
        let requests = layer.statistics.reduce((arr, stat) => {
            let p;
            let customCql = stat.custom_cql ? stat.custom_cql : '';
            switch (stat.type) {
                case "areaFilter": {
                    p = {params: {...params, cql_filter: areaFilter + customCql}};
                    break;
                }
                case "allFilter": {
                    p = {params: {...params, cql_filter: properties.params.cql_filter + customCql}};
                    break;
                }
                default: {
                    p = {params: {...params, cql_filter: customCql.length > 0 ? customCql : "INCLUDE"}};
                }
            }
            if (p.params.cql_filter !== stat.filter || stat.exception !== false) {
                arr.push(axios.get(url, p, {
                    timeout: 15000,
                    headers: {'Accept': 'application/json', 'Content-Type': 'text/plain'}
                }).then((response) => {
                    let config = response.data;
                    let s = config.indexOf("numberOfFeatures");
                    let obj;
                    if (s !== -1) {
                        let value = parseInt(config.substring(s + 18, config.indexOf('"', s + 19)), 10);
                        obj = {...stat, value: value, excepiton: false, filter: p.params.cql_filter};
                    } else {
                        obj = {...stat, value: null, excepiton: true};
                    }
                    return obj;
                }).catch(()=> {
                    return {...stat, value: null, excepiton: true};
                }));
            }else {
                arr.push(Promise.resolve({...stat}));
            }
            return arr;
        }, []);
        return axios.all(requests).then((results) => {
            dispatch(statsLoading(false));
            results.sort((a, b) => (a.id - b.id) );
            dispatch(changeLayerProperties(layer.id, {statistics: results}));
        });
    };


}

function getNumberOfFeatures(layer) {
    let url = layer.url.replace('wms', 'ows');
    let params = {
        service: "WFS",
        request: "getFeature",
        version: "1.1.0",
        resultType: "hits",
        typeNames: layer.name
    };
    return (dispatch) => {
        return axios.get(url, {params: params}, {
                timeout: 15000,
                headers: {'Accept': 'application/json', 'Content-Type': 'text/plain'}
            }).then((response) => {
                let config = response.data;
                let s = config.indexOf("numberOfFeatures");
                if (s !== -1) {
                    let value = parseInt(config.substring(s + 18, config.indexOf('"', s + 19)), 10);
                    dispatch(changeLayerProperties(layer.id, {numberOfFeatures: value}));
                }
            });
    };
}

function changeDownloadFormat(format) {
    return {
        type: CHANGE_DOWNLOAD_FORMAT,
        format
    };

}

function zoneGetValues(url, filter, id) {
    return (dispatch) => {
        return axios.post(url, filter, {
            timeout: 20000,
            headers: {'Accept': 'application/json', 'Content-Type': 'text/plain'}
        }).then((response) => {
            let config = response.data;
            if (typeof config !== "object") {
                try {
                    config = JSON.parse(config);
                } catch(e) {
                    dispatch(zoneSearchError('Search result broken (' + url + ":   " + filter + '): ' + e.message, id));
                }
            }

            dispatch(zoneFilter(config, id));
            dispatch(zoneSearch(false, id));
        }).catch((e) => {
            dispatch(zoneSearchError(e, id));
        });
    };
}
module.exports = {
    SWITCH_LAYER,
    SET_ACTIVE_ZONE,
    CHANGE_LAYER_PROPERTIES,
    STATS_LOADING,
    CHANGE_DOWNLOAD_FORMAT,
    changeLhtacLayerFilter,
    switchLayer,
    setActiveZone,
    changeDownloadFormat,
    getNumberOfFeatures,
    zoneGetValues
};
