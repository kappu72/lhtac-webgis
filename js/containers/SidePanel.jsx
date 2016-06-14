/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {connect} = require('react-redux');
const {getWindowSize} = require('../../MapStore2/web/client/utils/AgentUtils');
const {Glyphicon, Panel} = require('react-bootstrap');

const AccordionPanel = require("./AccordionPanel");
const {
    highlightStatus
} = require('../../MapStore2/web/client/actions/highlight');
const {featureSelectorReset} = require("../actions/featureselector");

const Statistics = connect((state) => ({
    activeLayer: state.lhtac.activeLayer,
    selectedfeatures: state.featureselector.features.length,
    highlightedfeatures: state.highlight.highlighted
}), {
    highlightStatus,
    featureSelectorReset
})(require("../components/Statistics"));

const SidePanel = React.createClass({
    propTypes: {
        expanded: React.PropTypes.bool,
        pinned: React.PropTypes.bool,
        onToggle: React.PropTypes.func,
        onPin: React.PropTypes.func,
        height: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            expanded: true,
            pinned: false,
            onToggle: () => {},
            onPin: () => {},
            height: "100%"
        };
    },
    render() {
        let panelStyle = {
            transform: this.props.expanded ? "translate3d(0, 0, 0)" : "translate3d(-100%, 0, 0)",
            transition: "all 0.5s",
            bottom: "0",
            height: this.props.height
        };

        let pinStyle = {
            transform: "rotate(" + (this.props.pinned ? "-45" : "0") + "deg)",
            height: this.props.height
        };
        let winH = getWindowSize().maxHeight;
        let hinPx = parseFloat(this.props.height) / 100 * winH;
        let accHeight = (hinPx - 42) * 0.5;
        let statHeight = (hinPx - 42) * 0.5;
        return (
            <div onMouseLeave={() => {
                let t = !this.props.pinned && this.props.expanded;
                if (t) { this.timeOut = setTimeout(this.toggle, 1500); }
            }} onMouseOver={() => {
                if (this.timeOut) { clearTimeout(this.timeOut); this.timeOut = null; }
            }}>
                <div id="lhac-sidepanel" style={panelStyle}>
                    <div className="header">
                        <span className="close" onClick={this.toggle}>×</span>
                        <span className="pin" style={pinStyle} onClick={this.pin}><Glyphicon glyph="pushpin"/></span>
                    </div>
                    <div className="body" style={{overflowY: "hidden"}} >
                        <div style={{height: accHeight, overflowY: "auto"}}>
                            <AccordionPanel height={accHeight}/>
                        </div>
                        <div style={{height: statHeight, overflowY: "auto"}}>
                            <Panel style={{marginBottom: 0}} className="lhtac-panel statistics-panel statistics-container" header={<h4>Statistics</h4>}>
                                <Statistics height={statHeight}/>
                            </Panel>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    toggle() {
        this.props.onToggle(this.props.expanded);
    },
    pin() {
        this.props.onPin(this.props.pinned);
    },
    timeOut: null
});

module.exports = SidePanel;
