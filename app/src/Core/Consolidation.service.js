angular.module('Pundit2.Core')
    .constant('CONSOLIDATIONDEFAULTS', {
        icon: '',
        colorClass: 'pnd-cons-yellow'
    })
    .service('Consolidation', function(CONSOLIDATIONDEFAULTS, BaseComponent, NameSpace, AnnotatorsOrchestrator, TextFragmentAnnotator) {
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

        var addItem = function(item) {
            var fragmentType = cc.isConsolidable(item);
            if (fragmentType === false) {
                cc.log("Not adding, item is not consolidable: "+ item.label);
                return;
            } else if (item.uri in itemListByURI) {
                cc.log("Item already present: "+ item.label);
                return;
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

            cc.log("Added item: " +item.label+" ("+ fragmentType +")");
        };

        addItems = function(items) {
            if (!angular.isArray(items)) {
                items = [items]
            }

            for (var l=items.length; l--;) {
                addItem(items[l]);
            }
        };
       
        cc.isConsolidable = function(item) {
            return AnnotatorsOrchestrator.isConsolidable(item);
        };
        
        cc.isConsolidated = function(item) {
            
        };

        cc.consolidate = function(items) {

            cc.wipe();
            addItems(items);
            // TODO: initial reset, do wipe something up!

            TextFragmentAnnotator.consolidate(itemListByType.text);
            // TODO: cycle over orchestrator something? or directly call him?
            // TODO: DOMConsolidator ? (xpointers: text fragments, named content, full page?)
            // TODO: ImageConsolidator ? (polygons, areas, whatever: on images?)
            // TODO: More consolidator types? Video? Maps? ..
        };
        

        return cc;
    });