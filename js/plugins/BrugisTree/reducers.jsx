
var {BRUGIS_TREE_LOAD_START, BRUGIS_TREE_LOADED, BRUGIS_TREE_LOAD_ERROR, BRUGIS_TREE_NODE_TOGGLE} = require('./actions');
var {REMOVE_NODE} = require('../../../MapStore2/web/client/actions/layers');
const assign = require('object-assign');
const EnvUtils = require('../../utils/EnvUtils');

const SOURCES_DICT = {
    'IBSA WMS - Geoserver': 'http://gis.irisnet.be/geoserver/ibsa_bisa/wms',
    'AGIV WMS - Basiskaart': 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB-basiskaart/wms',
    'AGIV WMS - Historische kaarten': "http://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms",
    'CIRB WMS - Geoserver': "http://geoservices-urbis.irisnet.be/geoserver/ows",
    'STIB WMS - Geoserver': "http://gis.irisnet.be/geoserver/stib_mivb/wms",
    'Bruxelles Mobilité WMS - Geoserver': "http://data-mobility.irisnet.be/geoserver/ows",
    'IBGE WMS - Mapserver': "http://wms.ibgebim.be/ibgewms",
    'default': EnvUtils.getBrugisGeoserverUrl()
};

function inspectKeywords(layer) {
    var wmsserver = SOURCES_DICT.default;
    if (layer && layer.keywordList && layer.keywordList.keyword) {
        layer.keywordList.keyword.forEach(function(keyword) {
            if (keyword.value && SOURCES_DICT[keyword.value]) {
                wmsserver = SOURCES_DICT[keyword.value];
            }
        });
    }
    return wmsserver;
}

function guidGenerator() {
    var s4 = function() {
        return (((1 + Math.random()) * 0X10000) | 0).toString(16).substr(1);
    };
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
}

function wmsWalker(layers) {
    var tmpNodes = [];
    if (typeof layers === "undefined" || layers === null || layers.length === 0) {
        tmpNodes = [];
    } else {
        layers.forEach(function(curLayer) {
            tmpNodes.push({
                "expanded": true,
                "name": curLayer.name,
                "title": curLayer.title,
                "path": true,
                "checked": false,
                "wmsserver": inspectKeywords(curLayer),
                "id": guidGenerator(),
                "childNodes": wmsWalker(curLayer.layer)
            });
        });
    }
    return tmpNodes;
}

function toggleNode(nodes, node) {
    var newNodes = [];
    if (typeof nodes === "undefined" || nodes === null || nodes.length === 0) {
        newNodes = [];
    } else {
        nodes.forEach(function(curNode) {
            var newNode = {
                "expanded": true,
                "name": curNode.name,
                "title": curNode.title,
                "path": curNode.path,
                "wmsserver": curNode.wmsserver,
                "id": curNode.id
            };
            if (curNode.name === node.name) {
                if (curNode.checked) {
                    newNode.checked = false;
                } else {
                    newNode.checked = true;
                }
            } else {
                newNode.checked = curNode.checked;
            }
            newNode.childNodes = toggleNode(curNode.childNodes, node);
            newNodes.push(assign({}, newNode));
        });
    }
    return newNodes;
}

function syncNodeWithLayer(nodes, node) {
    var newNodes = [];
    if (typeof nodes === "undefined" || nodes === null || nodes.length === 0) {
        newNodes = [];
    } else {
        nodes.forEach(function(curNode) {
            var newNode = {
                "expanded": true,
                "name": curNode.name,
                "title": curNode.title,
                "path": curNode.path,
                "wmsserver": curNode.wmsserver,
                "id": curNode.id
            };
            if (node === curNode.id) {
                if (curNode.checked) {
                    newNode.checked = false;
                } else {
                    newNode.checked = true;
                }
            } else {
                newNode.checked = curNode.checked;
            }
            newNode.childNodes = syncNodeWithLayer(curNode.childNodes, node);
            newNodes.push(assign({}, newNode));
        });
    }
    return newNodes;
}

function brugisTree(state = null, action) {
    switch (action.type) {
        case BRUGIS_TREE_LOAD_START:
            return state;
        case BRUGIS_TREE_LOADED:
            const capabilities = action.info;
            return assign({}, state, {
                treenodes: wmsWalker(capabilities.value.capability.layer.layer)
            });
        case BRUGIS_TREE_NODE_TOGGLE:
            let node = action.node;
            let newtreenodes = toggleNode(state.treenodes, node);
            return assign({}, state, {
                treenodes: newtreenodes
            });
        case BRUGIS_TREE_LOAD_ERROR:
            return state;
        case REMOVE_NODE:
            let layernode = action.node;
            let updatedtreenodes = syncNodeWithLayer(state.treenodes, layernode);
            return assign({}, state, {
                treenodes: updatedtreenodes
            });
        default:
            return state;
    }
}

module.exports = brugisTree;