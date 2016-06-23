/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {connect} = require('react-redux');

const {PanelGroup, Panel} = require('react-bootstrap');

const {bindActionCreators} = require('redux');

const {
    removeSpatialSelection,
    zoneGetValues,
    zoneSearch,
    // openMenu,
    zoneChange,
    resetZones,
    // zoneSelect
    simpleFilterFieldUpdate,
    removeAllSimpleFilterFields
} = require('../../MapStore2/web/client/actions/queryform');

const {
    changeLayerProperties
} = require('../../MapStore2/web/client/actions/layers');

const {
    changeDrawingStatus
} = require('../../MapStore2/web/client/actions/draw');

const {
    highlightStatus
} = require('../../MapStore2/web/client/actions/highlight');

const {
    featureSelectorReset
} = require('../actions/featureselector');

const {
    createFilterConfig,
    toggleFilter,
    setBaseCqlFilter
} = require('../actions/advancedfilter');

const SpatialFilter = connect((state) => ({
    useMapProjection: state.queryform.useMapProjection,
    spatialField: state.queryform.spatialField,
    showDetailsPanel: state.queryform.showDetailsPanel,
    withContainer: state.queryform.withContainer,
    spatialMethodOptions: state.queryform.spatialMethodOptions,
    spatialOperations: state.queryform.spatialOperations
}), (dispatch) => {
    return {
        actions: bindActionCreators({
            onRemoveSpatialSelection: removeSpatialSelection,
            zoneFilter: zoneGetValues,
            zoneSearch,
            // openMenu,
            zoneChange
            // zoneSelect
        }, dispatch)
    };
})(require('../../MapStore2/web/client/components/data/query/SpatialFilter'));

const {changeMapView} = require('../../MapStore2/web/client/actions/map');

const WMSCrossLayerFilter = connect((state) => ({
    spatialField: state.queryform.spatialField,
    toolbarEnabled: true,
    activeLayer: state.lhtac.activeLayer,
    mapConfig: state.map || {}
}), (dispatch) => {
    return {
        actions: bindActionCreators({
            changeHighlightStatus: highlightStatus,
            changeDrawingStatus: changeDrawingStatus,
            onQuery: changeLayerProperties,
            onReset: resetZones,
            changeMapView,
            featureSelectorReset,
            createFilterConfig,
            removeAllSimpleFilterFields,
            setBaseCqlFilter
        }, dispatch)
    };
})(require('../components/WMSCrossLayerFilter'));

const AdvancedFilter = connect((state) => ({
    fieldsConfig: state.queryform && state.queryform.simpleFilterFields || [],
    loading: state.advancedfilter && state.advancedfilter.requests.length > 0,
    filterstatus: state.advancedfilter && state.advancedfilter.filterstatus,
    spatialField: state.queryform.spatialField,
    activeLayer: state.lhtac.activeLayer,
    baseCqlFilter: state.advancedfilter && state.advancedfilter.baseCqlFilter,
    error: state.advancedfilter && state.advancedfilter.error
}), {
    simpleFilterFieldUpdate,
    changeLayerProperties,
    toggleFilter,
    featureSelectorReset,
    changeHighlightStatus: highlightStatus,
    changeDrawingStatus: changeDrawingStatus

})(require('../components/AdvancedFilter'));


const AccordionPanel = React.createClass({
    propTypes: {
        height: React.PropTypes.number
    },
    getDefaultProps() {
        return {};
    },
    getInitialState() {
        return {
            activeKey: '1'
        };
    },
    render() {
        return (
            <PanelGroup
                style={{marginTop: "5px", marginBottom: "5px"}}
                activeKey={this.state.activeKey}
                onSelect={this.handleSelect}
                accordion>
                <Panel className="lhtac-panel" header="Select and customize an area filter" eventKey="1">
                    <div style={{minHeight: this.props.height - 113}}>
                        <SpatialFilter/>
                        <WMSCrossLayerFilter
                            filterType={"OGC"}/>
                    </div>
                </Panel>
                <Panel className="lhtac-panel" header="Advanced Filter" eventKey="2">
                    <div style={{minHeight: this.props.height - 113}}>
                       <AdvancedFilter/>
                    </div>
                </Panel>
            </PanelGroup>
        );
    },
    handleSelect(activeKey) {
        this.setState({ activeKey });
    }
});

module.exports = AccordionPanel;
