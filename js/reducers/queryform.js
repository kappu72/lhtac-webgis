/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const msQueryform = require('../../MapStore2/web/client/reducers/queryform');
const queryFormConfig = require('../../queryFormConfig');
const {union, bbox} = require('turf');

function shouldReset(aId, dId, zones) {
    let reset = false;
    let zone = zones.find((z) => {
        return z.id === dId;
    });
    if (zone.dependson) {
        reset = (aId === zone.dependson.id) ? true : shouldReset(aId, zone.dependson.id, zones);
    }
    return reset;
}

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
            return {...state, simpleFilterFields: [], spatialField: {...state.spatialField,
                zoneFields: state.spatialField.zoneFields.map((field) => {
                    let f = {
                        ...field,
                        values: null,
                        value: null,
                        open: false,
                        error: null,
                        active: false
                    };

                    if (field.dependson) {
                        return {
                            ...f,
                            disabled: true,
                            open: false,
                            value: null,
                            dependson: {...field.dependson, value: null}
                        };
                    }

                    return f;
                }),
                geometry: null
            }};
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
        case 'ZONE_CHANGE': {
            let value; let geometry;
            const zoneFields = state.spatialField.zoneFields.map((field) => {
                if (field.id === action.id) {
                    value = field.multivalue ? action.value.value : action.value.value[0];

                    if (action.value.feature[0]) {
                        let f = action.value.feature[0];
                        let geometryName = f.geometry_name;
                        if (field.multivalue && action.value.feature.length > 1) {
                            for (let i = 1; i < action.value.feature.length; i++) {
                                let feature = action.value.feature[i];
                                if (feature) {
                                    f = union(f, feature);
                                }
                            }

                            geometry = {coordinates: f.geometry.coordinates, geometryName: geometryName, geometryType: f.geometry.type};
                        } else {
                            geometry = {coordinates: f.geometry.coordinates, geometryName: geometryName, geometryType: f.geometry.type};
                        }
                    }

                    return {
                            ...field,
                            value: value,
                            open: false,
                            geometryName: geometry ? geometry.geometryName : null
                        };
                }

                if (field.dependson && action.id === field.dependson.id) {
                    let disabled = (!value || (Array.isArray(value) && value.length === 0 )) ? true : false;
                    return {...field,
                        disabled: disabled,
                        values: null,
                        value: null,
                        open: false,
                        active: false,
                        dependson: {...field.dependson, value: value}
                    };
                }else if (field.dependson && shouldReset(action.id, field.dependson.id, state.spatialField.zoneFields)) {
                    return {...field,
                        disabled: true,
                        values: null,
                        value: null,
                        open: false,
                        active: false
                    };
                }

                return field;
            });

            let extent = bbox({
                type: "FeatureCollection",
                features: action.value.feature
            });

            return {...state, spatialField: {...state.spatialField,
                zoneFields: zoneFields,
                geometry: extent && geometry ? {
                    extent: extent,
                    type: geometry.geometryType,
                    coordinates: geometry.coordinates
                } : null
            }};
        }
        default:
            return msQueryform(state, action);
    }

}

module.exports = queryform;
