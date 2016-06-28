/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const msHighlight = require('../../MapStore2/web/client/reducers/highlight');

function highlight(state, action) {
    switch (action.type) {
        case 'TOGGLE_FILTER': {
            return {...state, status: 'disabled'};
        }
        case 'BASE_CQL_FILTER': {
            return {...state, status: 'disabled'};
        }
        case 'ZONES_RESET': {
            return {...state, status: 'disabled'};
        }
        default:
            return msHighlight(state, action);
    }
}

module.exports = highlight;
