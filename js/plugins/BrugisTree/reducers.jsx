
var {BRUGIS_TREE_LOAD_START, BRUGIS_TREE_LOADED, BRUGIS_TREE_LOAD_ERROR, BRUGIS_TREE_NODE_TOGGLE} = require('./actions');
const assign = require('object-assign');

function wmsWalker(layers) {
    var tmpNodes = [];
    var node = {};
    if (typeof layers === "undefined" || layers === null || layers.length === 0) {
        tmpNodes = [];
    } else {
        for (var i = 0; i < layers.length; i++){
            node = {};
            node.expanded = true;
            node.name = layers[i].name;
            node.title = layers[i].title;
            node.path = true;
            node.checked = false;
            node.id = Math.random().toString(16).substr(2,8);
            node.childNodes = wmsWalker(layers[i].layer);
            tmpNodes.push(node);
        }
    }
    return tmpNodes;
}

function toggleNode(nodes, node){
    if(typeof nodes === "undefined" || nodes === null || nodes.length === 0) {
        return [];
    } else {
        var new_nodes=[];
        for(var i=0; i < nodes.length; i++){
            var newNode = {
                expanded : true,
                name  : nodes[i].name,
                title : nodes[i].title,
                path  : nodes[i].path,
                id    : nodes[i].id
            };
            if(nodes[i].name == node.name){
                if(nodes[i].checked){
                    newNode.checked = false;
                } else {
                    newNode.checked = true;
                }
            } else {
                newNode.checked = nodes[i].checked;
            }
            newNode.childNodes = toggleNode(nodes[i].childNodes,node);
            new_nodes.push(assign({},newNode));
        }
        return new_nodes;
    }
}

function brugisTree(state = null, action) {
    switch (action.type) {
        case BRUGIS_TREE_LOAD_START:
            return state;
        case BRUGIS_TREE_LOADED:
            const capabilities =  action.info;
            var layers = capabilities.value.capability.layer.layer;
            var nodes = wmsWalker(layers);

            return assign({}, state, {
                treenodes : nodes
            });
        case BRUGIS_TREE_NODE_TOGGLE:
            let node = action.node;
            let newtreenodes = toggleNode(state.treenodes,node);

            return assign({}, state, {
                treenodes : newtreenodes
            });
        case BRUGIS_TREE_LOAD_ERROR:
            return state;
        default:
            return state;
    }
}

module.exports = brugisTree;
