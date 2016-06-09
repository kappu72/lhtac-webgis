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
            coordinates = coordinates.map((poly) => {
                return poly.map((point) => {
                    let p = CoordinatesUtils.reproject(point, polyTwo.projection, polyOne.projection);
                    return [p.x, p.y];
                });
            });
        }
        // TODO:: Turf expects geometry with coordinates in EPSG:4326
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
