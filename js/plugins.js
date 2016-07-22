/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    plugins: {
        MousePositionPlugin: require('../MapStore2/web/client/plugins/MousePosition'),
        PrintPlugin: require('../MapStore2/web/client/plugins/Print'),
        IdentifyPlugin: require('../MapStore2/web/client/plugins/Identify'),
        TOCPlugin: require('./plugins/TOC'),
        BackgroundSwitcherPlugin: require('../MapStore2/web/client/plugins/BackgroundSwitcher'),
        MeasurePlugin: require('./plugins/Measure'),
        MapPlugin: require('../MapStore2/web/client/plugins/Map'),
        ToolbarPlugin: require('../MapStore2/web/client/plugins/Toolbar'),
        DrawerMenuPlugin: require('../MapStore2/web/client/plugins/DrawerMenu'),
        ShapeFilePlugin: require('../MapStore2/web/client/plugins/ShapeFile'),
        SnapshotPlugin: require('../MapStore2/web/client/plugins/Snapshot'),
        SettingsPlugin: require('../MapStore2/web/client/plugins/Settings'),
        SearchPlugin: require('../MapStore2/web/client/plugins/Search'),
        ScaleBoxPlugin: require('../MapStore2/web/client/plugins/ScaleBox'),
        LocatePlugin: require('../MapStore2/web/client/plugins/Locate'),
        ZoomInPlugin: require('../MapStore2/web/client/plugins/ZoomIn'),
        ZoomOutPlugin: require('../MapStore2/web/client/plugins/ZoomOut'),
        ZoomAllPlugin: require('../MapStore2/web/client/plugins/ZoomAll'),
        MapLoadingPlugin: require('../MapStore2/web/client/plugins/MapLoading'),
        HelpPlugin: require('../MapStore2/web/client/plugins/Help'),
        OmniBarPlugin: require('../MapStore2/web/client/plugins/OmniBar'),
        ExpanderPlugin: require('../MapStore2/web/client/plugins/Expander'),
        BurgerMenuPlugin: require('../MapStore2/web/client/plugins/BurgerMenu'),
        UndoPlugin: require('../MapStore2/web/client/plugins/History'),
        RedoPlugin: require('../MapStore2/web/client/plugins/History'),
        AboutPlugin: require('./plugins/About'),
        ContactUsPlugin: require('./plugins/ContactUs'),
        ContextSwitchPlugin: require('./plugins/ContextSwitch'),
        FeatureSelectorPlugin: require('./plugins/FeatureSelector')
    },
    requires: {}
};
