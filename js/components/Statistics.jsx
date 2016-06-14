/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const {Panel, PanelGroup, ListGroup, ListGroupItem, Button} = require('react-bootstrap');

// const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');

const Legend = require('../../MapStore2/web/client/components/TOC/fragments/legend/Legend');

const Statistics = React.createClass({
    propTypes: {
        activeLayer: React.PropTypes.object,
        selectedfeatures: React.PropTypes.number,
        highlightedfeatures: React.PropTypes.number,
        highlightStatus: React.PropTypes.func,
        featureSelectorReset: React.PropTypes.func,
        height: React.PropTypes.number
    },
    getDefaultProps() {
        return {
            selectedfeatures: 0,
            highlightedfeatures: 0,
            activeLayer: {
                statistics: [],
                legend: {
                    height: 20,
                    width: 20,
                    options: ""
                }
            },
            changeDrawingStatus: () => {},
            highlightStatus: () => {},
            featureSelectorReset: () => {}
        };
    },
    getInitialState() {
        return { activeKey: '2'};
    },
    render() {
        return (
            <div>
            <div style={{minHeight: this.props.height - 128}}>
               <PanelGroup activeKey={this.state.activeKey}
                    onSelect={(activeKey) => {this.setState({activeKey}); }} accordion>
                <Panel eventKey="1"
                header="Download and statistics" collapsible>
                    <ListGroup className="lhtac-group-list">
                        <ListGroupItem key={1}>Selected: {this.props.selectedfeatures}</ListGroupItem>
                        <ListGroupItem key={2}>Highlighted: {this.props.highlightedfeatures}</ListGroupItem>
                    </ListGroup>
                    <ListGroup className="lhtac-group-list">
                        {
                            this.props.activeLayer.statistics.map((stat) => {
                                return (
                                    <ListGroupItem key={stat.id} href="#">{stat.name + " " + stat.value}</ListGroupItem>
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
