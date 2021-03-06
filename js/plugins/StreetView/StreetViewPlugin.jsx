const React = require('react');
const assign = require('object-assign');
const Message = require('../../../MapStore2/web/client/components/I18N/Message');
const {setControlProperty} = require('../../../MapStore2/web/client/actions/controls');
const streetviewIcon = require('./imgs/littleman-02.svg');
const {connect} = require('react-redux');
const {createSelector} = require('reselect');
const StreetView = require('./StreetView');
const {addLayer, removeLayer} = require('../../../MapStore2/web/client/actions/layers');
const {updateLocation} = require('./actions');
const {closeBrugisInfo} = require('./epics');

const selector = createSelector([
    (state) => state.controls && state.controls.streetview && state.controls.streetview.active === "streetView" || false,
    (state) => state.streetView && state.streetView.clickPoint && state.streetView.clickPoint.latlng && state.streetView.clickPoint.latlng.lat,
    (state) => state.streetView && state.streetView.clickPoint && state.streetView.clickPoint.latlng && state.streetView.clickPoint.latlng.lng,
    (state) => state.streetView && state.streetView.movPoint && state.streetView.movPoint && state.streetView.movPoint.lat,
    (state) => state.streetView && state.streetView.movPoint && state.streetView.movPoint && state.streetView.movPoint.lng,
    (state) => state.streetView && state.streetView.warning,
    (state) => state.locale && state.locale.current,
    (state) => state.streetView && state.streetView.clickPoint && state.streetView.clickPoint.move
], (enabled, lat, lng, latMov, lngMov, warning, locale, move) => ({
    enabled, lat, lng, latMov, lngMov, warning, locale, move
}));

const StreetViewPlugin = connect(selector, {
    toggleControl: setControlProperty.bind(null, 'streetview', 'active', "streetView", true),
    addLayer: addLayer,
    removeLayer: removeLayer,
    updateLocation: updateLocation
})(StreetView);

module.exports = {
    StreetViewPlugin: assign(StreetViewPlugin, {
        Toolbar: {
          id: "streetview",
          name: 'streetView',
          position: 7,
          tooltip: "streetview.tooltip",
          icon: <img src={streetviewIcon} height="45" width="38"></img>,
          help: <Message msgId="helptexts.streetviewButton"/>,
          // toggle: true
          exclusive: true
        }
    }),
    reducers: {
      streetView: require('./reducers')
    },
    epics: {
      closeBrugisInfo
    }
};
