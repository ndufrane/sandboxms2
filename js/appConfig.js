
module.exports = {
    pages: [{
        name: "map",
        path: "/",
        component: require('./pages/Main')
    }, {
        name: "infos",
        path: "/infos",
        component: require('./pages/Home')
    }, {
        name: "main",
        path: "/main",
        component: require('./pages/Main')
    }],
    pluginsDef: require('./plugins.js'),
    initialState: {
        defaultState: {
            mousePosition: {enabled: false},
            controls: {
                toolbar: {
                    active: null,
                    expanded: true
                },
                drawer: {
                    enabled: false,
                    menu: "1"
                }
            },
            brugisSurvey: {
                user: localStorage.getItem('currentUser')
            },
            mapInfo: { infoFormat: 'application/json' },
            maptype: { mapType: 'openlayers' },
            "catalog": {
              "default": {
                "newService": {
                    "url": "",
                    "type": "wms",
                    "title": "",
                    "isNew": true,
                    "autoload": false
                },
                "selectedService": "ORES POC Geoserver",
                "services": {
                  "ORES POC Geoserver": {
                    "url": "http://localhost:8080/geoserver/ores/wms",
                    "type": "wms",
                    "title": "ORES POC Geoserver",
                    "autoload": true
                  }
                }
              }
            }
        },
        mobile: {
            mapInfo: {enabled: true, infoFormat: 'text/html' },
            mousePosition: {enabled: true, crs: "EPSG:4326", showCenter: true}
        }
    },
    storeOpts: {
        persist: {
            whitelist: ["version"]
        }
    }
};
