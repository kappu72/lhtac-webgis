/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const msQueryform = require('../../MapStore2/web/client/reducers/queryform');
const queryFormConfig = require('../../queryFormConfig');

function queryform(state, action) {
    switch (action.type) {
        case "MAP_CONFIG_LOADED": {
            let contextLayers = action.config.map.layers.filter((layer) => layer.hasOwnProperty('active'));
            let activeLayer = (contextLayers.filter((layer) => layer.hasOwnProperty('active') && layer.active === true));
            return activeLayer.length > 0 ? queryFormConfig[activeLayer[0].name] : state;
        }
        case "SWITCH_LAYER": {
            return queryFormConfig[action.layer.name];
        }
        case 'BASE_CQL_FILTER': {
            return {...state, simpleFilterFields: []};
        }
        case 'ZONES_RESET': {
            return {...state, simpleFilterFields: []};
        }
        case 'SET_ACTIVE_ZONE': {
            let a = {...action, type: 'ZONE_CHANGE'};
            let tmpState = msQueryform(state, a);
            return {...tmpState, spatialField: {...tmpState.spatialField,
                    zoneFields: tmpState.spatialField.zoneFields.map((field) => {
                        let f = field;
                        if (action.id === field.id) {
                            f = {...field, active: true};
                        }else if (action.exclude.includes(field.id)) {
                            f = {
                                ...field,
                                value: null,
                                error: null,
                                active: false };
                        }
                        return f;
                    })
                    }
                };
        }
        default:
            return msQueryform(state, action);
    }

}

module.exports = queryform;
