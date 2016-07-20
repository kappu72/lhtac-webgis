/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Combobox = require('react-widgets').Combobox;

const DownlodFormatSelector = React.createClass({
    propTypes: {
        format: React.PropTypes.string,
        formatOptions: React.PropTypes.array,
        onChange: React.PropTypes.func
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            formatOptions: [{name: "CSV", value: "csv"}, {name: "Shapefile", value: "shape-zip"}, {name: "FileGDB", value: "OGR-FileGDB"}, {name: "Geo Package - OGR", value: "OGR-GPKG"}, {name: "Geo Package", value: "application/x-gpkg"}],
            onChange: () => {}
        };
    },
    render() {
        return (
            <Combobox
                placeholder="Select download format"
                data={this.props.formatOptions}
                value={this.props.format}
                valueField="value"
                textField="name"
                onChange={(obj) => this.props.onChange(obj.value)}/>
            );
    }
});

module.exports = DownlodFormatSelector;
