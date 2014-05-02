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

        cc.getItems = function() {
            return itemListByType;
        };

        cc.addItems = function(items, icon, colorClass) {

            if (angular.isArray(items)) {
                // TODO: cycle over, do something
            } else {
                
                var fragmentType = cc.isConsolidable(items);
                if (fragmentType === false) {
                    cc.log("Not adding, item is not consolidable: "+ items.label);
                    return;
                } else if (items.uri in itemListByURI) {
                    cc.log("Item already present: "+ items.label);
                    return;
                }

                // Add or create a new element for the indexes
                if (fragmentType in itemListByType) {
                    itemListByType[fragmentType][items.uri] = items;
                    typeUriMap[fragmentType].push(items.uri);
                } else {
                    typeUriMap[fragmentType] = [];
                    itemListByType[fragmentType] = {};
                    itemListByType[fragmentType][items.uri] = items;
                }

                itemListByURI[items.uri] = items;
                uriTypeMap[items.uri] = fragmentType;

                cc.log("Added item: " +items.label+" ("+ fragmentType +")");
            }
        };
       
        cc.isConsolidable = function(item) {
            return AnnotatorsOrchestrator.isConsolidable(item);
        };
        
        cc.isConsolidated = function(item) {
            
        };

        cc.consolidate = function() {
            TextFragmentAnnotator.consolidate(itemListByType['text']);
            // TODO: cycle over orchestrator something? or directly call him?
            // TODO: DOMConsolidator ? (xpointers: text fragments, named content, full page?)
            // TODO: ImageConsolidator ? (polygons, areas, whatever: on images?)
            // TODO: More consolidator types? Video? Maps? ..
        };
        

        return cc;
    });