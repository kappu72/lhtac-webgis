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
const {mapSelector} = require('../../MapStore2/web/client/selectors/map');

const selector = createSelector([mapSelector, state => state.mapInitialConfig], (map, mapInitialConfig) => ({mapConfig: map, mapInitialConfig: mapInitialConfig}));

const {changeMapView} = require('../../MapStore2/web/client/actions/map');

const ZoomToMaxExtentButton = connect(selector, {
    changeMapView
})(require('../../MapStore2/web/client/components/buttons/ZoomToMaxExtentButton'));

const Message = require('../../MapStore2/web/client/components/I18N/Message');

const ZoomToMaxExtentPlugin = React.createClass({
    render() {
        return (
            <ZoomToMaxExtentButton
                key="zoomToMaxExtent" {...this.props}
                tooltip={<Message msgId="zoombuttons.zoomAllTooltip"/>}
                useInitialExtent={true}/>);
    }
});


module.exports = {
    ZoomToMaxExtentPlugin: ZoomToMaxExtentPlugin,
    reducers: {}
};

