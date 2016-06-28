/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const assign = require('object-assign');

const {switchLayer} = require('../actions/lhtac');

const lhtac = require('../selectors/lhtac');
const {
    resetZones
} = require('../../MapStore2/web/client/actions/queryform');

const ContextSwitch = connect(lhtac, {
    switchLayer,
    resetZones
})(require('../components/ContextSwitch'));

module.exports = {
    ContextSwitchPlugin: assign(ContextSwitch, {
        Settings: {
            tool: <ContextSwitch key="contextswitch"/>,
            position: 4
        }
    }),
    reducers: {}
};
