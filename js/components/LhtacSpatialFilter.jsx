    /**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const { Panel, Button, ButtonToolbar} = require('react-bootstrap');

const ZoneField = require('../../MapStore2/web/client/components/data/query/ZoneField');

const SpatialFilter = React.createClass({
    propTypes: {
        useMapProjection: React.PropTypes.bool,
        spatialField: React.PropTypes.object,
        spatialOperations: React.PropTypes.array,
        spatialMethodOptions: React.PropTypes.array,
        spatialPanelExpanded: React.PropTypes.bool,
        showDetailsPanel: React.PropTypes.bool,
        withContainer: React.PropTypes.bool,
        actions: React.PropTypes.object
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            useMapProjection: true,
            spatialField: {},
            spatialPanelExpanded: true,
            showDetailsPanel: false,
            withContainer: true,
            spatialMethodOptions: [
                {id: "ZONE", name: "queryform.spatialfilter.methods.zone"}
                ],
            spatialOperations: [
                {id: "INTERSECTS", name: "queryform.spatialfilter.operations.intersects"}
            ],
            actions: {
                setActiveZone: () => {},
                zoneFilter: () => {},
                zoneSearch: () => {},
                zoneChange: () => {}
            }
        };
    },
    renderToolbar() {
        return (
        <ButtonToolbar style={{ marginTop: 10}}>
            <Button style={{marginTop: 5}} bsSize="small" onClick={this.selectAll}>Select All</Button>
            <Button style={{marginTop: 5}} bsSize="small" onClick={this.clearAll}>Clear All</Button>
      </ButtonToolbar>
            );
    },
    renderZoneFields() {
        return this.props.spatialField.method &&
            this.props.spatialField.method === "ZONE" &&
            this.props.spatialField.zoneFields &&
            this.props.spatialField.zoneFields.length > 0 ?
                this.props.spatialField.zoneFields.map((zone) => {
                    return (
                        <div key={zone.id} className={zone.active && zone.value && Array.isArray(zone.value) && zone.value.length > 0 ? "active-zone" : ''}>
                        <ZoneField
                            open={zone.open}
                            zoneId={zone.id}
                            url={zone.url}
                            typeName={zone.typeName}
                            wfs={zone.wfs}
                            busy={zone.busy}
                            label={zone.label}
                            values={zone.values}
                            value={zone.value}
                            valueField={zone.valueField}
                            textField={zone.textField}
                            searchText={zone.searchText}
                            searchMethod={zone.searchMethod}
                            searchAttribute={zone.searchAttribute}
                            sort={zone.sort}
                            error={zone.error}
                            disabled={zone.disabled}
                            dependsOn={zone.dependson}
                            groupBy={zone.groupBy}
                            multivalue={zone.multivalue}
                            onSearch={this.props.actions.zoneSearch}
                            onFilter={this.props.actions.zoneFilter}
                            onChange={this.zoneChange}/>
                            {(zone.toolBar) ? this.renderToolbar() : null}
                            </div>
                    );
                }) : (<span/>);
    },
    renderSpatialPanel() {
        return (
            <Panel>
                {this.renderZoneFields()}
            </Panel>
        );
    },
    render() {
        return (
            <div>
            {this.renderSpatialPanel()}
            </div>
        );
    },
    zoneChange(id, value) {
        let zoneField = this.props.spatialField.zoneFields.find((z) => {return z.id === id; });
        if (zoneField && zoneField.exclude && zoneField.exclude.length > 0) {
            this.props.actions.setActiveZone(id, value, zoneField.exclude);
        }else {
            this.props.actions.zoneChange(id, value);
        }
    }
});

module.exports = SpatialFilter;
