/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const uuid = require('node-uuid');
const axios = require('../../MapStore2/web/client/libs/ajax');
const {addSimpleFilterField} = require('../../MapStore2/web/client/actions/queryform');

const NEW_VALUES_REQUEST = 'NEW_VALUES_REQUEST';
const VALUES_LOADED = 'VALUES_LOADED';
const VALUES_LOAD_ERROR = 'VALUES_LOAD_ERROR';
const TOGGLE_FILTER = 'TOGGLE_FILTER';
const BASE_CQL_FILTER = 'BASE_CQL_FILTER';

function newValuesRequst(reqId) {
    return {
        type: NEW_VALUES_REQUEST,
        reqId
    };
}
function valuesLoaded(reqId) {
    return {
        type: VALUES_LOADED,
        reqId
    };
}
function valuesLoadError(reqId, error) {
    return {
        type: VALUES_LOAD_ERROR,
        reqId,
        error
    };
}
function createSimpleFilterField(field, options) {
    let fieldConf = field;
    let optionsValues = Array.isArray(options) ? options : [options];
    if (field.type === 'list') {
        let selvalues = optionsValues.map((opt) => {
            let val = opt;
            if (val === null) {
                val = "null";
            }else if (typeof val !== 'string') {
                val = opt.toString();
            }
            return val;
        }, this);
        if (!field.multivalue) {
            selvalues = (selvalues.length > 0) ? [selvalues[0]] : null;
        }
        fieldConf = {...fieldConf, optionsValues: optionsValues, values: selvalues};
    }else if (field.type === 'number') {
        let values = optionsValues.sort((a, b) => {
            return a - b;
        }, this);
        let min = (values.length > 1) ? values[0] : null;
        let max = (values.length > 1) ? values[values.length - 1] : null;
        let opt = field.options;
        opt = {...opt, min: min, max: max};
        let value = {lowBound: min, upBound: max};
        fieldConf = {...fieldConf, options: opt, values: value};
    }else if (field.type === "string") {
        fieldConf = {...fieldConf, values: null};
    }
    return addSimpleFilterField(fieldConf);
}

function createFilterConfig(wpsPrams, url, filed) {
    const reqId = uuid.v1();
    return (dispatch) => {
        dispatch(newValuesRequst(reqId));
        return axios.post(url, wpsPrams, {
            timeout: 20000,
            headers: {'Accept': 'application/json', 'Content-Type': 'text/plain'}
        }).then((response) => {
            let config = response.data;
            if (typeof config !== "object") {
                try {
                    config = JSON.parse(config);
                    dispatch(createSimpleFilterField(filed, config.values));
                    dispatch(valuesLoaded(reqId));
                } catch(e) {
                    dispatch(valuesLoadError(reqId, 'Failed Loading fields Values'));
                }
            }else {
                dispatch(createSimpleFilterField(filed, config.values));
                dispatch(valuesLoaded(reqId));
            }
        }).catch((e) => {
            dispatch(valuesLoadError(reqId, "Error during wps request " + e.statusText));
        });
    };
}
function setBaseCqlFilter(cql) {
    return {
        type: BASE_CQL_FILTER,
        cql
    };
}
function toggleFilter(status) {
    return {
        type: TOGGLE_FILTER,
        status
    };
}

module.exports = {
    NEW_VALUES_REQUEST,
    VALUES_LOADED,
    VALUES_LOAD_ERROR,
    TOGGLE_FILTER,
    BASE_CQL_FILTER,
    createFilterConfig,
    toggleFilter,
    setBaseCqlFilter
};
