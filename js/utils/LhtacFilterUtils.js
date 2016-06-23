/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const BaseFilter = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">' +
                '<ows:Identifier>gs:PagedUnique</ows:Identifier>' +
                  '<wps:DataInputs>' +
                    '<wps:Input>' +
                      '<ows:Identifier>features</ows:Identifier>' +
                      '<wps:Reference mimeType="application/json subtype=wfs-collection/1.0" xlink:href="http://geoserver/wfs?request=GetFeature&amp;version=1.0.0&amp;typeName=${typeName}&amp;CQL_FILTER=${cqlFilter}" method="GET"/> ' +
                    '</wps:Input>' +
                    '<wps:Input>' +
                      '<ows:Identifier>fieldName</ows:Identifier>' +
                      '<wps:Data>' +
                        '<wps:LiteralData>${attribute}</wps:LiteralData>' +
                      '</wps:Data>' +
                    '</wps:Input>' +
                  '</wps:DataInputs>' +
                  '<wps:ResponseForm>' +
                    '<wps:RawDataOutput mimeType="application/json">' +
                      '<ows:Identifier>result</ows:Identifier>' +
                    '</wps:RawDataOutput>' +
                  '</wps:ResponseForm>' +
                '</wps:Execute>';


const LhtacFilterUtils = {

    getWpsRequest(typeName, cqlFilter, attribute) {
        let cql = encodeURI(cqlFilter);
        let filter = BaseFilter.replace("${typeName}", typeName);
        filter = filter.replace("${cqlFilter}", cql);
        filter = filter.replace("${attribute}", attribute);
        return filter;

    },
    getZoneCrossFilter(spatialField) {
        let zone;
        // Get the latest zone with value in the array
        for (let i = spatialField.zoneFields.length - 1; i >= 0; i--) {
            if (spatialField.zoneFields[i].value) {
                zone = spatialField.zoneFields[i];
                break;
            }
        }

        // Get the attribute name (check for dotted notation)
        let attribute = zone.valueField.indexOf(".") !== -1 ? zone.valueField.split('.')[zone.valueField.split('.').length - 1] : zone.valueField;

        // Prepare the cql cross layer filter
        let filter = spatialField.operation +
            "(" + spatialField.attribute +
                ", collectGeometries(queryCollection('" +
                    zone.typeName +
                    "', '" + zone.geometryName +
                    "', '" + attribute;

        if (zone.value instanceof Array) {
            filter += " IN (";
            zone.value.forEach((value, index) => {
                filter += "''" + value + "''";
                if (index < zone.value.length - 1) {
                    filter += ",";
                }
            });
            filter += ")')))";
        } else {
            filter += " = ''" + zone.value + "''')))";
        }
        return filter;
    }
 };

module.exports = LhtacFilterUtils;
