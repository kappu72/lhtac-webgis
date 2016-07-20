/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const {Panel, PanelGroup, ListGroup, ListGroupItem, Button, OverlayTrigger, Tooltip} = require('react-bootstrap');

const Message = require('../../MapStore2/web/client/components/I18N/Message');

const Spinner = require('react-spinkit');
// const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');
const DownlodFormatSelector = require('./DownlodFormatSelector');
const Legend = require('../../MapStore2/web/client/components/TOC/fragments/legend/Legend');

const Statistics = React.createClass({
    propTypes: {
        activeLayer: React.PropTypes.object,
        selectedfeatures: React.PropTypes.number,
        highlightedfeatures: React.PropTypes.number,
        loading: React.PropTypes.bool,
        highlightStatus: React.PropTypes.func,
        featureSelectorReset: React.PropTypes.func,
        changeDownloadFormat: React.PropTypes.func,
        downloadFormat: React.PropTypes.string,
        height: React.PropTypes.number,
        getNumberOfFeatures: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            loading: false,
            downloadFormat: "csv",
            selectedfeatures: 0,
            highlightedfeatures: 0,
            activeLayer: {
                url: '',
                statistics: [],
                legend: {
                    height: 20,
                    width: 20,
                    options: ""
                }
            },
            changeDownloadFormat: () => {},
            highlightStatus: () => {},
            featureSelectorReset: () => {},
            getNumberOfFeatures: () => {}
        };
    },
    getInitialState() {
        return { activeKey: '2'};
    },
    componentDidMount() {
        if (this.props.activeLayer.numberOfFeatures === undefined || this.props.activeLayer.numberOfFeatures === null) {
            this.props.getNumberOfFeatures(this.props.activeLayer);
        }
    },
    componentDidUpdate() {
        if (this.props.activeLayer.numberOfFeatures === undefined || this.props.activeLayer.numberOfFeatures === null) {
            this.props.getNumberOfFeatures(this.props.activeLayer);
        }
    },
    render() {
        let wfsUrl = this.props.activeLayer.url.replace('wms', 'ows');
        wfsUrl += "?service=WFS&request=getFeature&version=1.1.0";
        wfsUrl += "&typeNames=" + this.props.activeLayer.name;
        wfsUrl += "&outputFormat=" + this.props.downloadFormat;
        if ( this.props.downloadFormat === 'OGR-GPKG') {
            wfsUrl += "&filename=" + this.props.activeLayer.title + ".geo";
        }
        return (
            <div>
            <div style={{minHeight: this.props.height - 128}}>
               <PanelGroup activeKey={this.state.activeKey}
                    onSelect={(activeKey) => {this.setState({activeKey}); }} accordion>
                <Panel eventKey="1"
                header="Download and statistics" collapsible>
                    <ListGroup className="lhtac-group-list">
                        <ListGroupItem key={1}>All: {this.props.activeLayer.numberOfFeatures}</ListGroupItem>
                        <ListGroupItem key={2}>Selected: {this.props.selectedfeatures}</ListGroupItem>
                        <ListGroupItem key={3}>Highlighted: {this.props.highlightedfeatures}</ListGroupItem>
                    </ListGroup>
                    <div style={{ height: 60}}>
                        <label><Message msgId="lhtac.downloadFormatLabel"/></label>
                        <DownlodFormatSelector
                            format={this.props.downloadFormat}
                            onChange={this.props.changeDownloadFormat}
                            />
                    </div>
                    <ListGroup className="lhtac-group-list">
                        {
                            this.props.activeLayer.statistics.map((stat) => {
                                let link = (stat.value) ? {href: wfsUrl + "&cql_filter=" + stat.filter} : {};

                                return stat.excepiton ? (
                                    <OverlayTrigger
                                        key={stat.id}
                                        placement="bottom"
                                        overlay={(<Tooltip id={"stat-" + stat.id + "-tooltip"}><Message msgId="lhtac.statsexcepiton"/></Tooltip>)}>
                                            <ListGroupItem
                                            style={{color: "red"}}
                                            >
                                            {stat.name}
                                        </ListGroupItem>
                                    </OverlayTrigger>
                                ) : (
                                    <ListGroupItem
                                    key={stat.id}
                                    style={(stat.value) ? {color: "blue"} : {}}
                                    {...link} download>
                                        {this.props.loading ? (<div><span>{stat.name}</span><div style={{"float": "right"}}><Spinner spinnerName="circle" noFadeIn/></div></div>) : (stat.name + " " + stat.value)}
                                    </ListGroupItem>
                                );
                            })
                        }
                    </ListGroup>
                </Panel>
                <Panel eventKey="2"
                    style={{marginTop: "15px"}}
                    header={this.props.activeLayer.title} collapsible>
                    <Legend
                        layer={this.props.activeLayer}
                        legendHeigth={this.props.activeLayer.legend.height || 20}
                        legendWidth={this.props.activeLayer.legend.width || 20}
                        legendOptions={this.props.activeLayer.legend.options}/>
                </Panel>
                </PanelGroup>
                </div>

                <Button style={{marginTop: "5px", "float": "right"}} onClick={this.resetStatistics}>
                       Clear Selections
                 </Button>

            </div>
        );
    },
    resetStatistics() {
        this.props.featureSelectorReset();
        this.props.highlightStatus("disabled");
    }
});

module.exports = Statistics;
