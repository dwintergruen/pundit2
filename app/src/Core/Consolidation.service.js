angular.module('Pundit2.Core')

.constant('CONSOLIDATIONDEFAULTS', {})

.service('Consolidation', function($rootScope, $location, CONSOLIDATIONDEFAULTS, BaseComponent, EventDispatcher, NameSpace, Config,
    Item, ItemsExchange, XpointersHelper) {

    var cc = new BaseComponent('Consolidation', CONSOLIDATIONDEFAULTS),
        state = {};

    // Wipes out every item, map, uri etc .. ready to get new items
    cc.wipe = function() {
        state.itemListByType = {};
        state.typeUriMap = {};
        state.uriTypeMap = {};
        state.itemListByURI = {};
        state.fragmentsItemListByParentURI = {};

        for (var a in state.annotators) {
            state.annotators[a].wipe();
        }

        cc.log('Wiped up!');
    };
    cc.wipe();

    // These two MUST NOT be wiped, or Consolidation will lose track of annotators
    state.annotableTypes = [];
    state.annotators = {};

    state.isRunningAnnomatic = false;
    $rootScope.$on('annomatic-run', function() {
        state.isRunningAnnomatic = true;
    });
    $rootScope.$on('annomatic-stop', function() {
        state.isRunningAnnomatic = false;
    });

    cc.getItems = function() {
        return state.itemListByURI;
    };

    cc.getFragmentParentList = function() {
        return state.fragmentsItemListByParentURI;
    };

    var addItems = function(items) {
        if (!angular.isArray(items)) {
            items = [items];
        }

        for (var l = items.length; l--;) {
            var item = items[l];

            var fragmentType = cc.isConsolidable(item);
            if (fragmentType === false) {
                cc.log("Not adding, item is not consolidable: " + item.label);
                continue;
            } else if (item.uri in state.itemListByURI) {
                cc.log("Item already present: " + item.label);
                continue;
            }

            // Add or create a new element for the indexes
            if (fragmentType in state.itemListByType) {
                state.itemListByType[fragmentType][item.uri] = item;
                state.typeUriMap[fragmentType].push(item.uri);
            } else {
                state.typeUriMap[fragmentType] = [];
                state.itemListByType[fragmentType] = {};
                state.itemListByType[fragmentType][item.uri] = item;
            }

            // Create or update parent list of fragments
            if (typeof(item.parentItemXP) !== 'undefined') {
                if (item.parentItemXP in state.fragmentsItemListByParentURI) {
                    state.fragmentsItemListByParentURI[item.parentItemXP].push(item);
                } else {
                    state.fragmentsItemListByParentURI[item.parentItemXP] = [item];
                }
            }

            state.itemListByURI[item.uri] = item;
            state.uriTypeMap[item.uri] = fragmentType;

            cc.log("Added item: " + item.label + " (" + fragmentType + ")");
        }
    };


    // Will consolidate every possible item found in the ItemsExchange
    cc.consolidateAll = function() {

        if (state.isRunningAnnomatic) {
            return;
        }

        var allItems = [];
        if (typeof(Config.modules.PageItemsContainer) !== 'undefined') {
            allItems = allItems.concat(ItemsExchange.getItemsByContainer(Config.modules.PageItemsContainer.container));
        }
        if (typeof(Config.modules.MyItems) !== 'undefined') {
            allItems = allItems.concat(ItemsExchange.getItemsByContainer(Config.modules.MyItems.container));
        }

        cc.log('Consolidating ALL items');
        cc.consolidate(allItems);
        EventDispatcher.sendEvent('Consolidation.consolidateAll');
    };

    // TODO: pass an element and consolidate just that element? or a named content?
    // an image or something?
    cc.consolidate = function(items) {

        // TODO: check if its not an array

        cc.log('Will try to consolidate ' + items.length + ' items');
        cc.wipe();
        addItems(items);

        for (var a in state.annotators) {
            if (a in state.itemListByType) {
                cc.log('Consolidating annotator type ' + a + ', ' + state.typeUriMap[a].length + ' items');
                state.annotators[a].consolidate(state.itemListByType[a]);
            } else {
                cc.log('Skipping annotator type ' + a + ': no item to consolidate.');
            }
        }

        // TODO: ImageConsolidator ? (polygons, areas, whatever: on images?)
        // TODO: More consolidator types? Video? Maps? ..
    };

    // Adds a new annotator to the Consolidation service
    cc.addAnnotator = function(annotator) {
        cc.log("Adding annotable type ", annotator.label);
        state.annotableTypes.push(annotator.label);
        state.annotators[annotator.label] = annotator;
    };

    // Calls every annotator and ask them if the given item is a
    // valid fragment. If it is, returns the fragment type.
    // This method must be implemented by every Annotator
    cc.isConsolidable = function(item) {
        for (var a in state.annotators) {
            if (state.annotators[a].isConsolidable(item)) {
                return a;
            }
        }
        return false;
    };

    cc.isConsolidated = function(item) {
        if (item instanceof Item) {
            return item.uri in state.itemListByURI;
        }
        return false;
    };

    // Gets the available targets or resources on the current page. They will most likely
    // be passed to the server looking for annotations.
    cc.getAvailableTargets = function(onlyNamedContents) {
        var ret = [],
            nc = XpointersHelper.options.namedContentClasses;

        // The page URL is for xpointers out of named contents
        if (typeof(onlyNamedContents) === "undefined" || onlyNamedContents !== true) {
            ret.push(decodeURIComponent($location.absUrl()));
        }

        // Look for named content: an element with a class listed in .namedContentClasses
        // then get its about attribute
        for (var l = nc.length; l--;) {
            var className = nc[l],
                nodes = angular.element('.' + className);

            for (var n = nodes.length; n--;) {
                // If it doesnt have the attribute, dont add it
                var uri = angular.element(nodes[n]).attr('about');
                // TODO: better checks of what we find inside about attributes? A lil regexp
                // or we let do this at the server?
                if (uri) {
                    ret.push(uri);
                }
            }
        }

        return ret;
    };

    return cc;
});