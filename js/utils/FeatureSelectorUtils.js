/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const CoordinatesUtils = require('../../MapStore2/web/client/utils/CoordinatesUtils');
const {intersect} = require('turf');

const FeatureSelectorUtils = {
    intersectPolygons(polyOne, polyTwo) {
        let {coordinates} = polyTwo;
        if (polyOne.projection !== polyTwo.projection) {
            coordinates = [coordinates[0].map((point) => {
                let p = CoordinatesUtils.reproject(point, polyTwo.projection, polyOne.projection);
                return [p.x, p.y];
            })];
        }
        let intersection = intersect({
                type: "Feature",
                geometry: polyOne},
                {
                type: "Feature",
                geometry: {
                    type: polyTwo.type,
                    coordinates: coordinates
                }});

        return (intersection !== undefined) ? {...intersection.geometry, projection: polyOne.projection } : undefined;

    }
};

module.exports = FeatureSelectorUtils;
