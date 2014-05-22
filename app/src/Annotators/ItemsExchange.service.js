angular.module('Pundit2.Core')
    .service('ItemsExchange', function(BaseComponent) {

        // TODO: inherit from a Store or something()? Annotations, items, ...
        var itemsExchange = new BaseComponent("ItemsExchange"),

            // container: [ array of ItemFactory objects belonging to that container ]
            itemListByContainer = {},
            // item uri : [ array of containers which contains the ItemFactory with that uri ]
            itemContainers = {},
            // [ array of ItemFactory objects ]
            itemList = [],
            // item uri : { ItemFactory object }
            itemListByURI = {};

        itemsExchange.wipe = function() {
            itemListByContainer = {};
            itemContainers = {};
            itemList = [];
            itemListByURI = {};
            itemsExchange.log('Wiped every loaded item and every container.');
        };

        // TODO need to remove item from default container if it's the only container
        // after wipe passed container
        itemsExchange.wipeContainer = function(container) {
            if (typeof(itemListByContainer[container]) === 'undefined') {
                itemsExchange.log('Cannot wipe undefined container '+ container);
                return;
            }

            // for each item inside specified container list
            itemListByContainer[container].forEach(function(item){
                // remove container from itemContainers object array
                itemContainers[item.uri].splice(itemContainers[item.uri].indexOf(container), 1);
            });
            // empty container list
            itemListByContainer[container] = [];

            itemsExchange.log('Wiped '+container+' container.');
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

        itemsExchange.addItemToContainer = function(item, containers) {

            if (!angular.isArray(containers)) {
                containers = [containers];
            }

            for (var i=containers.length; i--;) {
                var container = containers[i];

                if (item.uri in itemContainers && itemContainers[item.uri].indexOf(container) !== -1) {
                    itemsExchange.log('Item '+item.label+' already belongs to container '+container);
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

            if (typeof(containerItems) === 'undefined') {
                itemsExchange.err("Cannot remove item "+item.label+" from container "+ container+": container not found.");
                return;
            }

            var index = containerItems.indexOf(item);
            if (index === -1) {
                itemsExchange.err("Cannot remove item "+item.label+" from container "+ container+": item not in container.");
                return;
            }
            // remove item from itemListByContainer
            containerItems.splice(index, 1);

            // remove container from itemContainers
            var containerIndex = itemContainers[item.uri].indexOf(container);
            itemContainers[item.uri].splice(containerIndex, 1);

            itemsExchange.log("Item "+ item.label +" removed from container "+ container);
        };

        itemsExchange.addItems = function(items) {
            // TODO: sanity checks
            for (var l=items.length; l--;) {
                itemsExchange.addItem(items[l]);
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
                itemsExchange.log("Item already present: "+ item.uri);
                return;
            } else if (item.isProperty()) {
                // TODO: magic string, get it somewhere else, options, defaults, other component..
                container = "property";
            }

            itemListByURI[item.uri] = item;
            itemList.push(item);
            itemsExchange.addItemToContainer(item, container);

            itemsExchange.log("Added item: " +item.uri);
        };

        itemsExchange.log('Component up and running');
        return itemsExchange;
    });