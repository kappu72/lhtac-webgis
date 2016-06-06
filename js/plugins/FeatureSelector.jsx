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

const ComboField = require('../../MapStore2/web/client/components/data/query/ComboField');
const {createSelector} = require('reselect');
const LocaleUtils = require('../../MapStore2/web/client/utils/LocaleUtils');

const {
    changeDrawingStatus
} = require('../../MapStore2/web/client/actions/draw');
const {
    loadFeatures,
    featureSelectorError} = require('../actions/featureselector');
const {
    addLayer,
    changeLayerProperties
} = require('../../MapStore2/web/client/actions/layers');


const FeatureSelector = React.createClass({
    propTypes: {
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
        changeDrawingStatus: React.PropTypes.func,
        loadFeatures: React.PropTypes.func,
        featureSelectorError: React.PropTypes.func,
        addLayer: React.PropTypes.func,
        changeLayerProperties: React.PropTypes.func,
        error: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool])
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            drawFeatures: true,
            drawMethod: "Polygon",
            spatialMethodOptions: [
                {id: "BBOX", name: "queryform.spatialfilter.methods.box"},
                {id: "Polygon", name: "queryform.spatialfilter.methods.poly"}
            ],
            changeDrawingStatus: () => {},
            loadFeatures: () => {},
            addLayer: () => {},
            changeLayerProperties: () => {}
        };
    },
    componentDidMount() {
        this.key = (navigator && navigator.platform && navigator.platform === 'MacIntel') ? 'altKey' : 'ctrlKey';
        this.addKey = false;
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);

    },
        componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawStatus === "start" && nextProps.open) {
            window.addEventListener("keydown", this.handleKeyDown);
            window.addEventListener("keyup", this.handleKeyUp);
            this.addKey = false;
        }else {
            window.removeEventListener("keydown", this.handleKeyDown);
            window.removeEventListener("keyup", this.handleKeyUp);
        }
        if ( this.props.features !== nextProps.features && nextProps.drawFeatures) {
            this.props.changeLayerProperties("featureselector", {features: nextProps.features});
        }
        if (nextProps.drawStatus === "stop" && nextProps.drawStatus !== this.props.drawStatus) {
            this.props.changeDrawingStatus("clean", nextProps.drawMethod, '', []);
        }
        if (nextProps.geometry && nextProps.geometryStatus === "created" && nextProps.queryform.spatialField && nextProps.queryform.spatialField.geometry) {

            let spatialField = nextProps.queryform.spatialField;
            // Check SRS & Type
            let sFieldSRS = spatialField.geometry && spatialField.geometry.projection || "EPSG:4326";
            let sFieldType = spatialField.geometry.type || "Polygon";

            let prevGeometry = {
                    coordinates: [spatialField.geometry.coordinates],
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
                let ogcFilter = FilterUtils.toOGCFilter(nextProps.activeLayer.name, {spatialField: newSpatialFilter});
                this.props.loadFeatures(nextProps.queryform.searchUrl, ogcFilter, this.addKey);

            }else {
                this.props.featureSelectorError("Select some features");
            }

        }

    },

        renderMethodSelector(isActiveDraw) {
            const selectedMethod = this.props.spatialMethodOptions.filter((opt) => this.props.drawMethod === opt.id)[0];

            const methodCombo = (
                <ComboField
                disabled={!isActiveDraw}
                busy={(this.props.request && this.props.request.state === 'loading') ? true : false}
                fieldOptions={
                    this.props.spatialMethodOptions.map((opt) => {
                        return LocaleUtils.getMessageById(this.context.messages, opt.name);
                    })
                }
                fieldName="method"
                style={{width: "140px", marginBottom: "0px"}}
                fieldRowId={new Date().getUTCMilliseconds()}
                fieldValue={
                    LocaleUtils.getMessageById(this.context.messages, selectedMethod ? selectedMethod.name : "")
                }
                onUpdateField={this.updateSpatialMethod}/>
            );
            return methodCombo;
        },
        renderError() {
            return this.props.error ? (
                <Alert bsStyle="warning"
                        onDismiss={() => {this.props.featureSelectorError(false); }}>
                {this.props.error}
                </Alert>
                ) : null;
        },
        render() {
            let isActiveDraw = (this.props.drawStatus === "start") ? true : false;
            return this.props.open ? (
                <div id="feature-selection-bar" onKeyDown={this.keyDown}>
                   <div className="form-group">
                        <div className="input-group">
                            <span onClick={this.toggleDrawSupport} className={isActiveDraw ? "input-group-addon input-group-addon-disabled" : "input-group-addon"}>
                                        <Glyphicon glyph="move"/>
                            </span>
                        {this.renderMethodSelector(isActiveDraw)}
                        </div>
                    </div>
                    {this.renderError()}
                </div>
                ) : null;
        },
        toggleDrawSupport() {
            let isActiveDraw = (this.props.drawStatus === "start") ? true : false;
            let newStatus = isActiveDraw ? "stop" : "start";
            this.props.changeDrawingStatus(newStatus, this.props.drawMethod, '', []);
        },
        updateSpatialMethod(id, name, value) {
            const method = this.props.spatialMethodOptions.filter((opt) => {
                if (value === LocaleUtils.getMessageById(this.context.messages, opt.name)) {
                    return opt;
                }
            })[0].id;
            this.props.changeDrawingStatus('start', method, "queryform", []);
        },
        handleKeyDown(e) {
            this.addKey = e[this.key];
            event.preventDefault();
            event.stopPropagation();
        },
        handleKeyUp() {
            window.setTimeout(() => {this.addKey = false; }, 100);
        }
});
const selector = createSelector([
    (state) => (state.lhtac && state.lhtac.activeLayer || {}),
    (state) => (state.draw || {}),
    (state) => (state.featureselector || {}),
    (state) => (state.queryform || {})
], (activeLayer, draw, featureselector, queryform) => ({
    activeLayer,
    open: (activeLayer && activeLayer.params && activeLayer.params.cql_filter
          && activeLayer.params.cql_filter !== "INCLUDE") ? true : false,
    ...draw,
    ...featureselector,
    queryform
}));

const FeatureSelectorPlugin = connect(selector, {
        changeDrawingStatus: changeDrawingStatus,
        loadFeatures: loadFeatures,
        featureSelectorError: featureSelectorError,
        addLayer,
        changeLayerProperties
})(FeatureSelector);

module.exports = {
    FeatureSelectorPlugin: FeatureSelectorPlugin,
    reducers: {
        featureselector: require("../reducers/featureselector"),
        draw: require('../../MapStore2/web/client/reducers/draw')
    }
};
