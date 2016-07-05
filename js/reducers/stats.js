/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {STATS_LOADING, CHANGE_DOWNLOAD_FORMAT} = require('../actions/lhtac');

const initialState = {downloadFormat: "csv", loading: false};


function stats(state = initialState, action) {
    switch (action.type) {
        case STATS_LOADING: {
            return {...state, loading: action.status};
        }
        case CHANGE_DOWNLOAD_FORMAT: {
            return {...state, downloadFormat: action.format};
        }
        default:
            return state;
    }
}

module.exports = stats;
