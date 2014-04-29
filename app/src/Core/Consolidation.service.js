angular.module('Pundit2.Core')
    .constant('CONSOLIDATIONDEFAULTS', {
        icon: '',
        colorClass: 'pnd-cons-yellow'
    })
    .service('Consolidation', function(CONSOLIDATIONDEFAULTS, BaseComponent, NameSpace, AnnotatorsOrchestrator, XpointersHelper) {
        var cc = new BaseComponent('Consolidation', CONSOLIDATIONDEFAULTS);

        var itemListByType = {},
            typeUriMap = {}
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

            var xpointers = [],
                xpointerClasses = {},
                i = 0;
            
            // Produce a list of xpointers and an unique class name
            // for each one of them
            for (var uri in itemListByType['text']) {
                xpointers.push(uri);
                xpointerClasses[uri] = ["pnd-cons-"+i];
                i++;
            }

            var xpaths = XpointersHelper.getXPathsFromXPointers(xpointers);
            var sorted = XpointersHelper.splitAndSortXPaths(xpaths);
            console.log('xplissttts', xpaths, sorted);
            var htmlClasses = XpointersHelper.getClassesForXpaths(xpointers, sorted, xpaths, xpointerClasses);
            console.log('Html classes', htmlClasses);

            XpointersHelper.updateDOM(sorted, htmlClasses);

        };
        
        // TODO: DOMConsolidator ? (xpointers: text fragments, named content, full page?)
        // TODO: ImageConsolidator ? (polygons, areas, whatever: on images?)
        // TODO: More consolidator types? Video? Maps? .. 

        return cc;
    });