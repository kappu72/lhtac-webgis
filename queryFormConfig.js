const queryFormConfig = {

   "lhtac:web2014all_mv": {
        searchUrl: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
        showDetailsPanel: false,
        useMapProjection: false,
        withContainer: false,
        spatialMethodOptions: [
            {id: "ZONE", name: "queryform.spatialfilter.methods.zone"}
        ],
        spatialOperations: [
            {id: "INTERSECTS", name: "queryform.spatialfilter.operations.intersects"}
        ],
        spatialField: {
            method: "ZONE",
            attribute: "geom3857",
            operation: "INTERSECTS",
            geometry: null,
            zoneFields: [{
                id: 1,
                url: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
                typeName: "lhtac:itd_districts",
                values: [],
                value: null,
                valueField: "properties.ITD_Dist_n",
                textField: "properties.DistNum",
                searchText: "*",
                searchMethod: "ilike",
                searchAttribute: "DistNum",
                label: "ITD District",
                multivalue: false,
                sort: {
                    sortBy: "ITD_Dist_n",
                    sortOrder: "ASC"
                }
            }, {
                id: 2,
                url: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
                typeName: "lhtac:jurisdictions2014",
                label: "Road Jurisdiction",
                values: [],
                value: null,
                valueField: "properties.lhj2014_id",
                textField: "properties.name2",
                searchText: "*",
                searchMethod: "ilike",
                searchAttribute: "name2",
                disabled: true,
                multivalue: true,
                groupBy: "itd_dist",
                dependson: {
                    id: 1,
                    field: "itd_dist",
                    value: null
                }
            }]
        }
    },
    "lhtac:bridge2014all_mv": {
        searchUrl: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
        showDetailsPanel: false,
        useMapProjection: false,
        withContainer: false,
        spatialMethodOptions: [
            {id: "ZONE", name: "queryform.spatialfilter.methods.zone"}
        ],
        spatialOperations: [
            {id: "INTERSECTS", name: "queryform.spatialfilter.operations.intersects"}
        ],
        spatialField: {
            method: "ZONE",
            attribute: "the_geom",
            operation: "INTERSECTS",
            geometry: null,
            zoneFields: [
            {
                id: 3,
                url: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
                typeName: "lhtac:itd_districts",
                values: [],
                value: null,
                valueField: "properties.ITD_Dist_n",
                textField: "properties.DistNum",
                searchText: "*",
                searchMethod: "ilike",
                searchAttribute: "DistNum",
                label: "ITD District",
                multivalue: false,
                sort: {
                    sortBy: "ITD_Dist_n",
                    sortOrder: "ASC"
                }
            }, {
                id: 4,
                url: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
                typeName: "lhtac:county",
                values: [],
                value: null,
                valueField: "properties.short_name",
                textField: "properties.short_name",
                searchText: "*",
                searchMethod: "ilike",
                searchAttribute: "short_name",
                label: "County",
                multivalue: true,
                disabled: true,
                sort: {
                    sortBy: "short_name",
                    sortOrder: "ASC"
                },
                groupBy: "itd_distri",
                dependson: {
                    id: 3,
                    field: "itd_distri",
                    value: null
                }
            }, {
                id: 5,
                url: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
                typeName: "lhtac:city",
                values: [],
                value: null,
                valueField: "properties.short_name",
                textField: "properties.short_name",
                searchText: "*",
                searchMethod: "ilike",
                searchAttribute: "short_name",
                label: "City",
                multivalue: true,
                disabled: true,
                sort: {
                    sortBy: "short_name",
                    sortOrder: "ASC"
                },
                exclude: [6],
                groupBy: "county",
                dependson: {
                    id: 4,
                    field: "county",
                    value: null
                }
            },
            {
                id: 6,
                url: "http://demo.geo-solutions.it/geoserver/ows?service=WFS&outputFormat=application/json",
                typeName: "lhtac:jurisdictions2014",
                label: "Road Jurisdiction",
                values: [],
                value: null,
                valueField: "properties.name2",
                textField: "properties.name2",
                searchText: "HD",
                searchMethod: "ilike",
                searchAttribute: "juris_type",
                disabled: true,
                multivalue: true,
                groupBy: "county",
                sort: {
                    sortBy: "name2",
                    sortOrder: "ASC"
                },
                exclude: [5],
                dependson: {
                    id: 4,
                    field: "county",
                    value: null,
                    operator: "ilike"
                }
            }]
        }
    }
};

module.exports = queryFormConfig;
