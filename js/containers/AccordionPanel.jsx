/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {connect} = require('react-redux');
const {createSelector} = require('reselect');
const lhtac = require('../selectors/lhtac');

const {PanelGroup, Panel} = require('react-bootstrap');

const {bindActionCreators} = require('redux');

const {
    removeSpatialSelection,
    zoneSearch,
    // openMenu,
    zoneChange,
    resetZones,
    // zoneSelect
    simpleFilterFieldUpdate
} = require('../../MapStore2/web/client/actions/queryform');

const {
    createFilterConfig,
    toggleFilter,
    setBaseCqlFilter
} = require('../actions/advancedfilter');
const {
    setActiveZone,
    changeLhtacLayerFilter,
    zoneGetValues
    } = require('../actions/lhtac');

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
            setActiveZone,
            zoneChange
        }, dispatch)
    };
})(require('../components/LhtacSpatialFilter'));

const {changeMapView} = require('../../MapStore2/web/client/actions/map');

const WMSCrossSelector = createSelector([
        lhtac,
        (state) => (state.queryform.spatialField),
        (state) => (state.map || {})
        ],
        (lhtacState, spatialField, mapConfig) => ({
            activeLayer: lhtacState.activeLayer,
            toolbarEnabled: true,
            spatialField,
            mapConfig
        }));
const WMSCrossLayerFilter = connect( WMSCrossSelector, (dispatch) => {
    return {
        actions: bindActionCreators({
            onQuery: changeLhtacLayerFilter,
            onReset: resetZones,
            changeMapView,
            createFilterConfig,
            setBaseCqlFilter
        }, dispatch)
    };
})(require('../components/WMSCrossLayerFilter'));

const AdvancedFilterSelector = createSelector([
        lhtac,
        (state) => (state.queryform),
        (state) => (state.advancedfilter),
        (state) => (state.queryform.spatialField),
        (state) => (state.map || {})
        ],
        (lhtacState, queryform, advancedFilter) => ({
            activeLayer: lhtacState.activeLayer,
            fieldsConfig: queryform && queryform.simpleFilterFields || [],
            loading: advancedFilter && advancedFilter.requests.length > 0,
            filterstatus: advancedFilter && advancedFilter.filterstatus,
            spatialField: queryform.spatialField,
            baseCqlFilter: advancedFilter && advancedFilter.baseCqlFilter,
            error: advancedFilter && advancedFilter.error
        }));

const AdvancedFilter = connect(AdvancedFilterSelector, {
    simpleFilterFieldUpdate,
    changeLayerProperties: changeLhtacLayerFilter,
    toggleFilter
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
