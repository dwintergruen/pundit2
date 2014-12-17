angular.module('Pundit2.Core')
.service('ItemsExchange', function(BaseComponent) {

    // TODO: inherit from a Store or something()? Annotations, items, ...
    var itemsExchange = new BaseComponent("ItemsExchange"),

        // all properties are stored here
        defaultRelationsContainer = 'properties',

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

    itemsExchange.isItemInContainer = function(item, container) {
        if (typeof(container) === "undefined") {
            return false;
        }

        var list = itemContainers[item.uri];

        // Item not found .. !!?!
        if (typeof(list) === "undefined") {
            return false;
        }

        if (list.indexOf(container) === -1) {
            return false;
        }

        return true;
    };

    itemsExchange.wipeContainer = function(container) {
        if (typeof(itemListByContainer[container]) === 'undefined') {
            itemsExchange.log('Cannot wipe undefined container '+ container);
            return;
        }

        // for each item inside specified container list
        itemListByContainer[container].forEach(function(item){
            // remove container from itemContainers object array
            itemContainers[item.uri].splice(itemContainers[item.uri].indexOf(container), 1);
            // if we have zero container must remove item everywhere
            // TODO: is the right choice check if it is equal to zero?
            if (itemContainers[item.uri].length === 0) {
                delete itemContainers[item.uri];
                delete itemListByURI[item.uri];
                var itemIndex = itemList.indexOf(item);
                if (itemIndex !== -1){
                    itemList.splice(itemIndex, 1);
                }
            }
        });
        // empty container list
        delete itemListByContainer[container];

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

    itemsExchange.getItemsFromContainerByFilter = function(container, filter) {
        if (typeof(filter) !== "function") {
            return;
        }

        if (typeof(itemListByContainer[container]) === "undefined") {
            return;
        }

        var ret = [];
        var itemList = itemListByContainer[container];
        for (var uri in itemList) {
            var item = itemList[uri];
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

    // TODO must be refactor, pass uri instead of new item reference
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

    // TODO must be refactor, pass uri instead of new item reference
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
        // if we have zero container must remove item everywhere
        // TODO: is the right choice check if it is equal to zero?
        if (itemContainers[item.uri].length === 0) {
            delete itemContainers[item.uri];
            delete itemListByURI[item.uri];
            var itemIndex = itemList.indexOf(item);
            if (itemIndex !== -1){
                itemList.splice(itemIndex, 1);
            }
        }

        itemsExchange.log("Item "+ item.label +" removed from container "+ container);
    };

    itemsExchange.addItems = function(items) {
        // TODO: sanity checks
        for (var l=items.length; l--;) {
            itemsExchange.addItem(items[l]);
        }
    };

    var extendRangeAndDomain = function(uri, range, domain) {
        var p = itemListByURI[uri];
        
        var i;
        // empty array coding a free range
        if (range.length === 0) {
            p.range = [];
        } else if (p.range.length > 0) {
            for (i in range) {
                // if the range is not already present
                if (p.range.indexOf(range[i]) === -1) {
                    p.range.push(range[i]);
                }
            }
        }
        // empty array coding a free domain
        if (domain.length === 0) {
            p.domain = [];
        } else if (p.domain.length > 0) {
            for (i in domain) {
                // if the domain is not already present
                if (p.domain.indexOf(domain[i]) === -1) {
                    p.domain.push(domain[i]);
                }
            }
        }

    };

    var addLabel = function(uri, label) {
        var p = itemListByURI[uri];

        if (typeof(p.mergedLabel) === 'undefined') {
            if (p.label !== label) {
                p.mergedLabel = p.label + '_' + label;
            }
        } else if (p.mergedLabel.indexOf(label) === -1) {
            p.mergedLabel += '_' + label;
        }
    };

    var addVocab = function(uri, vocab) {
        var p = itemListByURI[uri];

        if (typeof(p.mergedVocabulary) === 'undefined') {
            p.mergedVocabulary = [p.vocabulary, vocab];
        } else if (p.mergedVocabulary.indexOf(vocab) === -1) {
            p.mergedVocabulary.push(vocab);
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
            // the item that we try to add already exist
            itemsExchange.log("Item already present: "+ item.uri);
            
            // skip if come from an annotation
            if (item.isProperty() && !item.isAnnotationProperty) {

                // if the item that already exist is an annotation item
                // we need to replace it every time
                // otherwise we update the item
                if (itemListByURI[item.uri].isAnnotationProperty) {
                    // remove old item                        
                    var index = itemListByContainer[defaultRelationsContainer].indexOf(itemListByURI[item.uri]);
                    if (index > -1) {
                        itemListByContainer[defaultRelationsContainer].splice(index, 1);
                    }
                    delete itemContainers[item.uri];
                    delete itemListByURI[item.uri];
                    // add the new property to the default container 
                    container = defaultRelationsContainer;
                } else {
                    // update the old item (merge of range, domain and vocabs)
                    extendRangeAndDomain(item.uri, item.range, item.domain);
                    addLabel(item.uri, item.label);
                    addVocab(item.uri, item.vocabulary);
                    
                    return;
                }

            }

        } else if (item.isProperty()) {
            // default propeties container
            // the first time that a propeties is loaded it is added to this container
            container = defaultRelationsContainer;
        }

        itemListByURI[item.uri] = item;
        itemList.push(item);
        itemsExchange.addItemToContainer(item, container);

        itemsExchange.log("Added item: " +item.uri);
    };

    itemsExchange.log('Component up and running');
    return itemsExchange;
});