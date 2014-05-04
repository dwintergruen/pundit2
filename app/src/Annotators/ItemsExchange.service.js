angular.module('Pundit2.Core')
    .service('ItemsExchange', function(BaseComponent, NameSpace) {

        // TODO: inherit from a Store or something()? Annotations, items, ...
        var itemsExchange = new BaseComponent("ItemsExchange");

        var itemListByContainer = {},
            itemContainers = {};
            itemList = [],
            itemListByURI = {};

        itemsExchange.getItems = function() {
            return itemList;
        };

        itemsExchange.getAll = function() {
            return {
                itemListByContainer: itemListByContainer,
                itemContainers: itemContainers
            };
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