/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const assign = require('object-assign');

const {Button, Glyphicon, ButtonToolbar, Modal} = require('react-bootstrap');

const I18N = require('../../MapStore2/web/client/components/I18N/I18N');

const mapUtils = require('../../MapStore2/web/client/utils/MapUtils');
const CoordinatesUtils = require('../../MapStore2/web/client/utils/CoordinatesUtils');

const WMSCrossLayerFilter = React.createClass({
    propTypes: {
        params: React.PropTypes.object,
        spatialField: React.PropTypes.object,
        toolbarEnabled: React.PropTypes.bool,
        mapConfig: React.PropTypes.object,
        showGeneratedFilter: React.PropTypes.oneOfType([
            React.PropTypes.bool,
            React.PropTypes.string
        ]),
        activeLayer: React.PropTypes.object,
        actions: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            params: {},
            mapConfig: {},
            spatialField: {},
            toolbarEnabled: true,
            showGeneratedFilter: false,
            activeLayer: {},
            actions: {
                onQuery: () => {},
                onReset: () => {},
                changeMapView: () => {},
                changeDrawingStatus: () => {}
            }
        };
    },
    render() {
        let queryDisabled = !this.props.toolbarEnabled || !this.props.spatialField.geometry;

        return (
            <div>
                <ButtonToolbar className="crossFilterToolbar">
                    <Button disabled={queryDisabled} id="query" onClick={this.search}>
                        <Glyphicon glyph="glyphicon glyphicon-search"/>
                        <span style={{paddingLeft: "2px"}}><strong><I18N.Message msgId={"queryform.query"}/></strong></span>
                    </Button>
                    <Button disabled={!this.props.toolbarEnabled} id="reset" onClick={this.reset}>
                        <Glyphicon glyph="glyphicon glyphicon-remove"/>
                        <span style={{paddingLeft: "2px"}}><strong><I18N.Message msgId={"queryform.reset"}/></strong></span>
                    </Button>
                </ButtonToolbar>
                <Modal show={this.props.showGeneratedFilter ? true : false} bsSize="large">
                    <Modal.Header>
                        <Modal.Title>Generated Filter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <textarea style={{width: "862px", maxWidth: "862px", height: "236px", maxHeight: "236px"}}>{this.props.showGeneratedFilter}</textarea>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{"float": "right"}} onClick={() => this.props.actions.onQuery(null, null)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    },
    search() {
        let zone;

        // Get the latest zone with value in the array
        for (let i = this.props.spatialField.zoneFields.length - 1; i >= 0; i--) {
            if (this.props.spatialField.zoneFields[i].value) {
                zone = this.props.spatialField.zoneFields[i];
                break;
            }
        }

        // Get the attribute name (check for dotted notation)
        let attribute = zone.valueField.indexOf(".") !== -1 ? zone.valueField.split('.')[zone.valueField.split('.').length - 1] : zone.valueField;

        // Prepare the cql cross layer filter
        let filter = this.props.spatialField.operation +
            "(" + this.props.spatialField.attribute +
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
            filter += ")'";
        } else {
            filter += " = ''" + zone.value + "''')))";
        }

        filter += ")))";

        let params = assign({}, this.props.params, {cql_filter: filter});
        this.props.actions.onQuery(this.props.activeLayer.id, {params: params});
        this.props.actions.changeDrawingStatus('start', 'BBOX', 'wmscrossfilter', []);
        // Zoom to the selected geometry
        if (this.props.spatialField.geometry && this.props.spatialField.geometry.extent) {
            const bbox = this.props.spatialField.geometry.extent;
            const mapSize = this.props.mapConfig.present.size;

            const newZoom = mapUtils.getZoomForExtent(CoordinatesUtils.reprojectBbox(bbox, "EPSG:4326", this.props.mapConfig.present.projection), mapSize, 0, 21, null);
            const newCenter = mapUtils.getCenterForExtent(bbox, "EPSG:4326");

            this.props.actions.changeMapView(newCenter, newZoom, {
                bounds: {
                   minx: bbox[0],
                   miny: bbox[1],
                   maxx: bbox[2],
                   maxy: bbox[3]
                },
                crs: "EPSG:4326",
                rotation: 0
            }, this.props.mapConfig.present.size, null, this.props.mapConfig.present.projection);
        }
    },
    reset() {
        this.props.actions.onReset();
        this.props.actions.changeDrawingStatus('clean', 'BBOX', 'wmscrossfilter', []);
        let params = assign(this.props.params, {cql_filter: "INCLUDE"});
        this.props.actions.onQuery(this.props.activeLayer.id, {params: params});
    }
});

module.exports = WMSCrossLayerFilter;
