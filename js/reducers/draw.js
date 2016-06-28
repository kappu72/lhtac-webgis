/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const msDraw = require('../../MapStore2/web/client/reducers/draw');


function draw(state, action) {
    switch (action.type) {
        case 'TOGGLE_FILTER': {
            return {...state,
                drawStatus: 'start',
                drawOwner: 'advancedfilter',
                drawMethod: 'BBOX',
                features: []
            };
        }
        case 'BASE_CQL_FILTER': {
            return {...state,
                drawStatus: 'start',
                drawOwner: 'wmscrossfilter',
                drawMethod: 'BBOX',
                features: []
            };
        }
        case 'ZONES_RESET': {
            return {...state,
                drawStatus: 'clean',
                drawOwner: 'wmscrossfilter',
                drawMethod: 'BBOX',
                features: []
            };
        }
        default:
            return msDraw(state, action);
    }
}

module.exports = draw;
