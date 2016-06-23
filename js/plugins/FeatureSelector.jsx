/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');

const {Glyphicon, Alert} = require('react-bootstrap');
const FeatureSelectorUtils = require('../utils/FeatureSelectorUtils');
const FilterUtils = require('../../MapStore2/web/client/utils/FilterUtils');

const Spinner = require('react-spinkit');
const {createSelector} = require('reselect');

const {
    changeDrawingStatus
} = require('../../MapStore2/web/client/actions/draw');
const {
    highlightStatus
} = require('../../MapStore2/web/client/actions/highlight');
const {
    loadFeatures,
    featureSelectorError} = require('../actions/featureselector');
const {
    addLayer,
    changeLayerProperties
} = require('../../MapStore2/web/client/actions/layers');


const FeatureSelector = React.createClass({
    propTypes: {
        bboxGlyph: React.PropTypes.string,
        polyGlyph: React.PropTypes.string,
        drawFeatures: React.PropTypes.bool,
        activeLayer: React.PropTypes.object,
        request: React.PropTypes.object,
        drawMethod: React.PropTypes.string,
        drawStatus: React.PropTypes.string,
        geometry: React.PropTypes.object,
        geometryStatus: React.PropTypes.string,
        open: React.PropTypes.bool,
        spatialMethodOptions: React.PropTypes.array,
        features: React.PropTypes.array,
        hstatus: React.PropTypes.string,
        changeDrawingStatus: React.PropTypes.func,
        loadFeatures: React.PropTypes.func,
        featureSelectorError: React.PropTypes.func,
        addLayer: React.PropTypes.func,
        changeLayerProperties: React.PropTypes.func,
        changeHighlightStatus: React.PropTypes.func,
        queryform: React.PropTypes.object,
        advancedFilterStatus: React.PropTypes.bool,
        error: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool])
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            advancedFilterStatus: false,
            bboxGlyph: "unchecked",
            polyGlyph: "edit",
            drawFeatures: true,
            drawMethod: "Polygon",
            spatialMethodOptions: [
                {id: "BBOX", name: "queryform.spatialfilter.methods.box"},
                {id: "Polygon", name: "queryform.spatialfilter.methods.poly"}
            ],
            simpleFilterFields: [],
            changeDrawingStatus: () => {},
            loadFeatures: () => {},
            addLayer: () => {},
            changeLayerProperties: () => {},
            changeHighlightStatus: () => {}
        };
    },
    componentDidMount() {
        this.addKey = false;
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);

    },
    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    },
    componentWillReceiveProps(nextProps) {

        if (this.props.features !== nextProps.features && nextProps.drawFeatures) {
            this.props.changeLayerProperties("featureselector", {features: nextProps.features});
            if (this.props.hstatus === 'disabled') {
                this.props.changeHighlightStatus('enabled');
            }else {
                this.props.changeHighlightStatus('update');
            }
        }
        if (nextProps.geometry && nextProps.geometryStatus === "created" && nextProps.queryform.spatialField && nextProps.queryform.spatialField.geometry) {

            let spatialField = nextProps.queryform.spatialField;
            // Check SRS & Type
            let sFieldSRS = spatialField.geometry && spatialField.geometry.projection || "EPSG:4326";
            let sFieldType = spatialField.geometry.type || "Polygon";

            let prevGeometry = {
                    coordinates: spatialField.geometry.coordinates,
                    projection: sFieldSRS,
                    type: sFieldType
                };
            let intersection = FeatureSelectorUtils.intersectPolygons(prevGeometry, nextProps.geometry);

            if (intersection !== undefined) {
                let newSpatialFilter = {
                    attribute: spatialField.attribute,
                    method: nextProps.drawMethod,
                    operation: spatialField.operation,
                    geometry: intersection
                };
                let filterOpt = {spatialField: newSpatialFilter};
                if (this.props.advancedFilterStatus && this.props.queryform.simpleFilterFields && this.props.queryform.simpleFilterFields.length > 0) {
                    filterOpt.simpleFilterFields = this.props.queryform.simpleFilterFields;
                }
                let ogcFilter = FilterUtils.toOGCFilter(nextProps.activeLayer.name, filterOpt, "1.1.0");
                this.props.loadFeatures(nextProps.queryform.searchUrl, ogcFilter, this.addKey);
                if (!this.addKey) {
                    this.props.changeHighlightStatus('disabled');
                }
                this.addKey = false;
            }else {
                this.addKey = false;
                this.props.featureSelectorError("Select some features");
            }
            this.props.changeDrawingStatus("clean", '', 'featureselector', []);

        }

    },
    renderError() {
        return this.props.error ? (

            <Alert calssName="selector-error" bsStyle="warning"
                    onDismiss={() => {this.props.featureSelectorError(false); }}>
            {this.props.error}
            </Alert>
            ) : null;
    },
    render() {
        return this.props.open ? (
            <div id="feature-selection-bar" onKeyDown={this.keyDown}>
                    {(this.props.request.state === 'loading') ? (
                       <div className="selector-spinner">
                            <Spinner spinnerName="wordpress" noFadeIn/>
                        </div>) : (
                 <div className="button-container">
                    <div style={{"float": "left"}} className={this.getButtonClass("BBOX")}
                    onClick={this.updateSpatialMethod.bind(null, 'BBOX')}>
                            <Glyphicon glyph={this.props.bboxGlyph}/>
                    </div>
                    <div style={{"float": "right"}} className={this.getButtonClass("Polygon")}
                            onClick={this.updateSpatialMethod.bind(null, 'Polygon')}>
                            <Glyphicon glyph={this.props.polyGlyph}/>
                    </div>
                </div>
                )
                }
                {this.renderError()}
            </div>
            ) : null;
    },
    getButtonClass(type) {
        return (type === this.props.drawMethod && this.props.drawStatus === "start" ) ? "pressed" : "";
    },
    toggleDrawSupport() {
        let isActiveDraw = (this.props.drawStatus === "start") ? true : false;
        let newStatus = isActiveDraw ? "stop" : "start";
        this.props.changeDrawingStatus(newStatus, this.props.drawMethod, 'featureselector', []);
    },
    updateSpatialMethod(value) {
        if (this.props.drawMethod === value) {
            this.props.changeDrawingStatus('stop', '', "featureselector", []);
        }else {
            this.props.changeDrawingStatus('start', value, "featureselector", []);
        }

    },
    handleKeyDown(e) {
        this.addKey = e.ctrlKey || e.metaKey;
    },
    handleKeyUp() {
        window.setTimeout(() => {this.addKey = false; }, 100);
    }
});
const selector = createSelector([
    (state) => (state.lhtac && state.lhtac.activeLayer || {}),
    (state) => (state.draw || {}),
    (state) => (state.featureselector || {}),
    (state) => (state.queryform || {}),
    (state) => (state.highlight && state.highlight.status || 'disabled'),
    (state) => (state.advancedfilter || {})
], (activeLayer, draw, featureselector, queryform, hstatus, advancedfilter) => ({
    activeLayer,
    open: (activeLayer && activeLayer.params && activeLayer.params.cql_filter
          && activeLayer.params.cql_filter !== "INCLUDE") ? true : false,
    ...draw,
    ...featureselector,
    queryform,
    hstatus,
    advancedFilterStatus: advancedfilter.filterstatus
}));

const FeatureSelectorPlugin = connect(selector, {
        changeDrawingStatus: changeDrawingStatus,
        loadFeatures: loadFeatures,
        featureSelectorError: featureSelectorError,
        addLayer,
        changeLayerProperties,
        changeHighlightStatus: highlightStatus
})(FeatureSelector);

module.exports = {
    FeatureSelectorPlugin: FeatureSelectorPlugin,
    reducers: {
        featureselector: require("../reducers/featureselector"),
        draw: require('../../MapStore2/web/client/reducers/draw'),
        highlight: require('../../MapStore2/web/client/reducers/highlight')
    }
};
