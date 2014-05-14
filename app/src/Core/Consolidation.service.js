angular.module('Pundit2.Core')
    .constant('CONSOLIDATIONDEFAULTS', {
    })
    .service('Consolidation', function(CONSOLIDATIONDEFAULTS, BaseComponent, NameSpace, AnnotatorsOrchestrator, TextFragmentAnnotator, Item) {
        var cc = new BaseComponent('Consolidation', CONSOLIDATIONDEFAULTS);

        var itemListByType = {},
            typeUriMap = {},
            uriTypeMap = {},
            itemListByURI = {};

        cc.wipe = function() {
            itemListByType = {};
            typeUriMap = {};
            uriTypeMap = {};
            itemListByURI = {};
        };

        cc.getItems = function() {
            return itemListByURI;
        };

        var addItems = function(items) {
            if (!angular.isArray(items)) {
                items = [items]
            }

            for (var l=items.length; l--;) {
                var item = items[l];

                var fragmentType = cc.isConsolidable(item);
                if (fragmentType === false) {
                    cc.log("Not adding, item is not consolidable: " + item.label);
                    continue;
                } else if (item.uri in itemListByURI) {
                    cc.log("Item already present: " + item.label);
                    continue;
                }

                // Add or create a new element for the indexes
                if (fragmentType in itemListByType) {
                    itemListByType[fragmentType][item.uri] = item;
                    typeUriMap[fragmentType].push(item.uri);
                } else {
                    typeUriMap[fragmentType] = [];
                    itemListByType[fragmentType] = {};
                    itemListByType[fragmentType][item.uri] = item;
                }

                itemListByURI[item.uri] = item;
                uriTypeMap[item.uri] = fragmentType;

                cc.log("Added item: " + item.label + " (" + fragmentType + ")");
            }
        };

        cc.isConsolidable = function(item) {
            return AnnotatorsOrchestrator.isConsolidable(item);
        };
        
        cc.isConsolidated = function(item) {
            if (item instanceof Item)
                return item.uri in itemListByURI;
            else
                return false;
        };

        // TODO: pass an element and consolidate just that element? or a named content?
        // an image or something?
        cc.consolidate = function(items) {

            // TODO: check if its not an array

            cc.log('Will try to consolidate '+items.length+' items');
            cc.wipe();
            addItems(items);
            // TODO: initial reset, do wipe something up!

            TextFragmentAnnotator.consolidate(itemListByType.text);

            // TODO: Extract if everything was ok? It should be .. ?

            // TODO: cycle over orchestrator something? or directly call him?
            // TODO: DOMConsolidator ? (xpointers: text fragments, named content, full page?)
            // TODO: ImageConsolidator ? (polygons, areas, whatever: on images?)
            // TODO: More consolidator types? Video? Maps? ..
        };

        return cc;
    });