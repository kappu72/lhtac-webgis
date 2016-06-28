/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const msLayers = require('../../MapStore2/web/client/reducers/layers');

function layers(state, action) {
    switch (action.type) {
        case 'SWITCH_LAYER': {
            const flatLayers = (state.flat || []);
            const newLayers = flatLayers.map((layer) => {
                if (layer.id === action.layer.id) {
                    return {...layer, active: true, visibility: true};
                } else if (layer.active) {
                    // TODO remove
                    return {...layer, active: false, visibility: false, params: {...layer.params, cql_filter: "INCLUDE"}};
                }
                return {...layer};
            });
            return {...state, flat: newLayers};
        }
        default:
            return msLayers(state, action);
    }
}

module.exports = layers;

