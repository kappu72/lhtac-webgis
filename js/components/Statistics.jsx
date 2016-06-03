/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
// const assign = require('object-assign');

const {Panel, ListGroup, ListGroupItem, Button} = require('react-bootstrap');

// const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');

const Legend = require('../../MapStore2/web/client/components/TOC/fragments/legend/Legend');

const Statistics = React.createClass({
    propTypes: {
        activeLayer: React.PropTypes.object,
        selectedfeatures: React.PropTypes.number
    },
    getDefaultProps() {
        return {
            selectedfeatures: 0,
            activeLayer: {
                statistics: [],
                legend: {
                    height: 20,
                    width: 20,
                    options: ""
                }
            }
        };
    },
    render() {
        return (
            <div>
                <Panel header="Download and statistics" collapsible>
                    <ListGroup className="lhtac-group-list">
                        <ListGroupItem key={1}>Selected: {this.props.selectedfeatures}</ListGroupItem>
                        <ListGroupItem key={2}>Highlighted: 0</ListGroupItem>
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
                <Panel style={{marginTop: "15px"}} header={this.props.activeLayer.title}>
                    <Legend
                        layer={this.props.activeLayer}
                        legendHeigth={this.props.activeLayer.legend.height || 20}
                        legendWidth={this.props.activeLayer.legend.width || 20}
                        legendOptions={this.props.activeLayer.legend.options}/>
                </Panel>
                <Button style={{marginTop: "15px", "float": "right"}} onClick={() => {}}>
                    Clear Selections
                </Button>
            </div>
        );
    }
});

module.exports = Statistics;
