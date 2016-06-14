/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const LOAD_FEATURES = 'LOAD_FEATURES';
const FEATURES_LOADED = 'FEATURES_LOADED';
const NEW_GETFEATURE_REQUEST = 'NEW_GETFEATURE_REQUEST';
const FEATURE_SELECTOR_ERROR = 'FEATURE_SELECTOR_ERROR';
const FEATURE_SELECTOR_REST = 'FEATURE_SELECTOR_REST';
const uuid = require('node-uuid');
const axios = require('../../MapStore2/web/client/libs/ajax');
const {resizeHeight} = require('./sidepanel');

function featureSelectorReset() {
    return {
        type: FEATURE_SELECTOR_REST
    };
}
function newGetFeatureRequest(reqId, filter) {
    return {
        type: NEW_GETFEATURE_REQUEST,
        reqId,
        filter
    };
}

function featuresLoaded(features, reqId, add = false) {
    return {
        type: FEATURES_LOADED,
        features,
        reqId,
        add
    };
}

function featureSelectorError(error) {
    return {
        type: FEATURE_SELECTOR_ERROR,
        error
    };
}

function loadFeatures(url, filter, add) {
    const reqId = uuid.v1();
    return (dispatch) => {
        dispatch(newGetFeatureRequest(reqId, filter));
        return axios.post(url, filter, {
            timeout: 10000,
            headers: {'Accept': 'application/json', 'Content-Type': 'text/plain'}
        }).then((response) => {
            let config = response.data;
            if (typeof config !== "object") {
                try {
                    config = JSON.parse(config);
                    dispatch(featuresLoaded(config.features, reqId, add));
                    if (config.features && config.features.length > 0) {
                        dispatch(resizeHeight("80%"));
                    }else {
                        dispatch(resizeHeight("100%"));
                    }
                } catch(e) {
                    dispatch(featureSelectorError('Search result broken (' + url + ":   " + filter + '): ' + e.message));
                }
            }else {
                dispatch(featuresLoaded(config.features, reqId, add));
                if (config.features && config.features.length > 0) {
                    dispatch(resizeHeight("80%"));
                }else {
                    dispatch(resizeHeight("100%"));
                }
            }
        }).catch((e) => {
            dispatch(featureSelectorError("Error during wfs request " + e.statusText));
        });
    };

}


module.exports = {
    LOAD_FEATURES,
    FEATURES_LOADED,
    NEW_GETFEATURE_REQUEST,
    FEATURE_SELECTOR_ERROR,
    FEATURE_SELECTOR_REST,
    loadFeatures,
    featuresLoaded,
    featureSelectorError,
    featureSelectorReset
};
