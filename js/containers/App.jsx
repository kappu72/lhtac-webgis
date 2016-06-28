/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const Debug = require('../../MapStore2/web/client/components/development/Debug');
const Localized = require('../../MapStore2/web/client/components/I18N/Localized');

const {connect} = require('react-redux');

const url = require('url');
const urlQuery = url.parse(window.location.href, true).query;
const mapType = urlQuery.mapType ? urlQuery.mapType : "leaflet";

require('react-widgets/lib/less/react-widgets.less');
require('../../assets/css/lhtac.css');
require('../../assets/css/mapstore2.css');

const App = (props) => {
    const MapViewer = connect(() => ({
        plugins: props.plugins
    }))(require('../pages/MapViewer'));
    return (
        <div className="fill">
            <Localized messages={props.messages} locale={props.current} loadingError={props.localeError}>
                <MapViewer mapType={mapType}/>
            </Localized>
            <Debug/>
        </div>
    );
};

module.exports = connect((state) => {
    return state.locale && {...state.locale} || {};
})(App);
