/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


const React = require('react');
const {getWindowSize} = require('../../MapStore2/web/client/utils/AgentUtils');

const LhtacFeatureGrid = require('../components/LhtacFeatureGrid');


const SouthPanel = React.createClass({
    propTypes: {
        initHeight: React.PropTypes.number,
        height: React.PropTypes.number,
        resizeHeight: React.PropTypes.func.isRequired,
        maxHeight: React.PropTypes.number
    },
    contextTypes: {
        messages: React.PropTypes.object,
        resizeHeight: () => {}
    },
    getDefaultProps() {
        return {
            initHeight: 20,
            maxHeight: 50
        };
    },
    getInitialState() {
        return {
            heigth: 10
        };
    },
    componentWillMount() {
        this.drag = false;
        this.startPosition = undefined;
        this.setState({height: this.props.initHeight});
    },
    componentDidMount() {
        window.addEventListener("mouseup", this.dragStop, this);
    },
    componentWillReceiveProps(nextProps) {
        if (this.state.height !== nextProps.height) {
            this.setState({height: nextProps.height});
        }
    },
    componentWillUnmount() {
        window.removeEventListener("mouseup", this.dragStop, this);
    },
    render() {
        this.height = getWindowSize().maxHeight;
        return (<div id="south-panel" style={{height: this.state.height + "%"}}>
                    <div ref="dragBar"
                        onMouseDown={this.dragStart}
                        className="header">
                    </div>
                        <LhtacFeatureGrid update={!this.drag} style={{width: "100%", height: (this.state.height / 100 * this.height) - 10 }}/>
            </div>);
    },
    dragStart(e) {
        this.drag = true;
        e.preventDefault();
        this.startPosition = e.clientY;
        window.addEventListener( "mousemove", this.move);
    },
    dragStop() {
        if (this.drag) {
            this.drag = false;
            this.startPosition = null;
            window.removeEventListener( "mousemove", this.move);
            let newVal = 100 - this.state.height + "%";
            this.props.resizeHeight(newVal);
        }
    },
    move(e) {
        if (this.startPosition) {
            let diff = ((e.clientY - this.startPosition) / this.height) * 100;
            let newHeight = this.state.height - diff;
            if ((newHeight / 100 * this.height) > 5 && newHeight < this.props.maxHeight) {
                this.startPosition = e.clientY;
                this.setState({height: newHeight});
            }
        }
    }
});

module.exports = SouthPanel;
