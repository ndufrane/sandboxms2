/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const ReactDOM = require('react-dom');
const {connect} = require('react-redux');
const ol = require('openlayers');

const StandardApp = require('../MapStore2/web/client/components/app/StandardApp');

const {pages, pluginsDef, initialState, storeOpts} = require('./appConfig');

const StandardRouter = connect((state) => ({
    locale: state.locale || {},
    pages
}))(require('../MapStore2/web/client/components/app/StandardRouter'));

const appStore = require('./stores/store').bind(null, initialState, {});

const appConfig = {
    storeOpts,
    appStore,
    pluginsDef,
    initialActions: [],
    appComponent: StandardRouter
};

var lb72Projection = new ol.proj.Projection({
     code: 'EPSG:31370',
     extent: [0, 0, 300000, 300000],
     units: 'm'
});
ol.proj.addProjection(lb72Projection);

ReactDOM.render(
    <StandardApp {...appConfig}/>,
    document.getElementById('container')
);
