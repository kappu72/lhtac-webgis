/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {Glyphicon} = require('react-bootstrap');

let MSPlugin = require("../../MapStore2/web/client/plugins/Measure");

MSPlugin.MeasurePlugin.Toolbar = {...MSPlugin.MeasurePlugin.Toolbar,
            icon: <Glyphicon glyph="1-stilo"/>
        };

module.exports = MSPlugin;
