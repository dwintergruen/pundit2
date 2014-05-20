angular.module('Pundit2.Core')
    .service('ItemsExchange', function(BaseComponent, NameSpace) {

        // TODO: inherit from a Store or something()? Annotations, items, ...
        var itemsExchange = new BaseComponent("ItemsExchange");

        // TODO where define?
        itemsExchange.pageItemContainer = 'pageItems';

        var itemListByContainer = {},
            itemContainers = {},
            itemList = [],
            itemListByURI = {};

        itemsExchange.wipe = function() {
            itemsExchange.log('Wiping every loaded item.');
            itemListByContainer = {};
            itemContainers = {};
            itemList = [];
            itemListByURI = {};
        };

        itemsExchange.wipeContainer = function(container) {
            itemsExchange.log('Wiping every container item.');
            itemListByContainer[container] = [];
        };

        itemsExchange.getItems = function() {
            return itemList;
        };
        itemsExchange.getItemsHash = function() {
            return itemListByURI;
        };

        itemsExchange.getItemByUri = function(uri) {
            if (uri in itemListByURI) {
                return itemListByURI[uri];
            }
            // If the item is not found, it will return undefined
        };

        itemsExchange.getAll = function() {
            return {
                itemListByURI: itemListByURI,
                itemListByContainer: itemListByContainer,
                itemContainers: itemContainers
            };
        };

        itemsExchange.getItemsBy = function(filter) {
            if (typeof(filter) !== "function") {
                return;
            }

            var ret = [];
            for (var uri in itemListByURI) {
                var item = itemListByURI[uri];
                if (filter(item)) {
                    ret.push(item);
                }
            }
            return ret;
        };

        itemsExchange.getItemsByContainer = function(container) {
            if (typeof(itemListByContainer[container]) !== "undefined") {
                return itemListByContainer[container];
            } else {
                // TODO: name not found, signal error? .log? .err?
                return [];
            }
        };

        itemsExchange.addItems = function(items) {
            // TODO: sanity checks
            for (var l=items.length; l--;) {
                itemsExchange.addItem(items[l]);
            }
        };

        itemsExchange.addItemToContainer = function(item, containers) {

            if (!angular.isArray(containers)) {
                containers = [containers];
            }

            for (var i=containers.length; i--;) {
                var container = containers[i];

                if (itemContainers[item.uri] && itemContainers[item.uri].indexOf(container) !== -1) {
                    console.log('Already belongs to this container');
                    return;
                }

                if (container in itemListByContainer) {
                    itemListByContainer[container].push(item);
                } else {
                    itemListByContainer[container] = [item];
                }

                if (item.uri in itemContainers) {
                    itemContainers[item.uri].push(container);
                } else {
                    itemContainers[item.uri] = [container];
                }
            }

        };

        itemsExchange.removeItemFromContainer = function(item, container) {

            var containerItems = itemListByContainer[container];

            var index = containerItems.indexOf(item);

            if (index === -1) {
                itemsExchange.err("Ouch, cannot remove this item (not find) ... ", item);
                return;
            } else {
                containerItems.splice(index, 1); 
                itemsExchange.log("Item removed: "+ item.label);
            }            

        };

        itemsExchange.addItem = function(item, container) {

            if (typeof(container) === "undefined") {
                container = "default";
            }

            // An item to be good must have an array of types and at least a uri
            if (typeof(item.uri) === "undefined" || !angular.isArray(item.type)) {
                itemsExchange.err("Ouch, cannot add this item ... ", item);
                return;
            } else if (item.uri in itemListByURI) {
                itemsExchange.log("Item already present: "+ item.label);
                return;
            } else if (item.isProperty()) {
                // TODO: magic string, get it somewhere else, options, defaults, other component..
                container = "property";
            }

            itemListByURI[item.uri] = item;
            itemList.push(item);
            itemsExchange.addItemToContainer(item, container);

            itemsExchange.log("Added item: " +item.label);
        };

        itemsExchange.log('Component up and running');
        return itemsExchange;
    });