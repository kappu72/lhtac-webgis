/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const SWITCH_LAYER = 'SWITCH_LAYER';
const SET_ACTIVE_ZONE = 'SET_ACTIVE_ZONE';
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
module.exports = {
    SWITCH_LAYER,
    SET_ACTIVE_ZONE,
    switchLayer,
    setActiveZone
};
