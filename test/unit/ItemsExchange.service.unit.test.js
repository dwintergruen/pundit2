/*global testItems*/

describe('ItemsExchange service', function() {

    var ItemsExchange, Item;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_ItemsExchange_, _Item_){
        ItemsExchange = _ItemsExchange_;
        Item = _Item_;
    }));

    afterEach(function(){
        ItemsExchange.wipe();
    });

    it('should correctly add item', function(){

        var textItem = testItems.completeFragmentTextItem,
            imageItem = testItems.completeFragmentImageItem,
            freebaseItem = testItems.completeFreebaseItem;

        ItemsExchange.addItem(textItem);
        ItemsExchange.addItem(imageItem, 'myTestContainer');
        ItemsExchange.addItem(freebaseItem, 'myTestContainer');

        // all item is added to itemList
        var itemList = ItemsExchange.getItems();
        expect(itemList.indexOf(textItem)).toBeGreaterThan(-1);
        expect(itemList.indexOf(imageItem)).toBeGreaterThan(-1);
        expect(itemList.indexOf(freebaseItem)).toBeGreaterThan(-1);

        var all = ItemsExchange.getAll();
        // all item is listed by uri
        expect(all.itemListByURI[textItem.uri]).toBe(textItem);
        expect(all.itemListByURI[imageItem.uri]).toBe(imageItem);
        expect(all.itemListByURI[freebaseItem.uri]).toBe(freebaseItem);
        // all item is listed by container
        expect(all.itemListByContainer['default'].indexOf(textItem)).toBeGreaterThan(-1);
        expect(all.itemListByContainer['myTestContainer'].indexOf(imageItem)).toBeGreaterThan(-1);
        expect(all.itemListByContainer['myTestContainer'].indexOf(freebaseItem)).toBeGreaterThan(-1);

        expect(all.itemListByContainer['myTestContainer'].length).toBe(2);
    });

    it('should not add duplicated item by addItem()', function(){

        var textItem = testItems.completeFragmentTextItem;

        ItemsExchange.addItem(textItem);
        ItemsExchange.addItem(textItem, 'myTestContainer');

        // all item is added to itemList
        var itemList = ItemsExchange.getItems();
        expect(itemList.length).toBe(1);
    });

    it('should not add duplicated item by addItemToContainer()', function(){

        var textItem = testItems.completeFragmentTextItem;

        ItemsExchange.addItemToContainer(textItem, 'myTestContainer');
        ItemsExchange.addItemToContainer(textItem, 'myTestContainer');

        var all = ItemsExchange.getAll();
        expect(all.itemListByContainer['myTestContainer'].length).toBe(1);
    });

    it('should correctly remove item from container', function(){

        var textItem = testItems.completeFragmentTextItem;

        ItemsExchange.addItemToContainer(textItem, 'myTestContainer');
        ItemsExchange.removeItemFromContainer(textItem, 'myTestContainer');

        var all = ItemsExchange.getAll();
        expect(all.itemListByContainer['myTestContainer'].length).toBe(0);
        expect(all.itemContainers[textItem.uri]).toBeUndefined();
        expect(all.itemListByURI[textItem.uri]).toBeUndefined();
    });

    it('should not add bad item', function(){

        var badUriItem = angular.copy(testItems.completeFragmentTextItem);
        delete badUriItem.uri;

        var badTypeItem = angular.copy(testItems.completeFragmentTextItem);
        badTypeItem.type = 'typeMustBeArray';

        ItemsExchange.addItem(badUriItem);
        ItemsExchange.addItem(badTypeItem);

        // all item is added to itemList
        var itemList = ItemsExchange.getItems();
        expect(itemList.length).toBe(0);
    });

    it('should correctly find item inside container', function(){

        var textItem = testItems.completeFragmentTextItem,
            imageItem = testItems.completeFragmentImageItem;

        ItemsExchange.addItem(textItem);
        ItemsExchange.addItem(imageItem, 'myTestContainer');

        expect(ItemsExchange.isItemInContainer(textItem, 'default')).toBe(true);
        expect(ItemsExchange.isItemInContainer(imageItem, 'default')).toBe(false);
        expect(ItemsExchange.isItemInContainer(textItem, 'myTestContainer')).toBe(false);
        expect(ItemsExchange.isItemInContainer(imageItem, 'myTestContainer')).toBe(true);
        expect(ItemsExchange.isItemInContainer({uri: 'fakeuri'}, 'default')).toBe(false);

    });

    it('should correctly wipe container', function(){

        var textItem = testItems.completeFragmentTextItem,
            imageItem = testItems.completeFragmentImageItem;
        ItemsExchange.addItemToContainer(textItem, 'myTestContainer');
        ItemsExchange.addItemToContainer(imageItem, 'myTestContainer');

        ItemsExchange.wipeContainer('myTestContainer');

        var all = ItemsExchange.getAll();
        expect(all.itemListByContainer['myTestContainer']).toBeUndefined();
        expect(all.itemContainers[textItem.uri]).toBeUndefined();
        expect(all.itemContainers[imageItem.uri]).toBeUndefined();
    });

    it('should corectly get item by uri', function(){

        var textItem = testItems.completeFragmentTextItem;
        ItemsExchange.addItem(textItem);

        expect(ItemsExchange.getItemByUri(textItem.uri)).toBe(textItem);
        expect(ItemsExchange.getItemByUri('fakeUri')).toBeUndefined();
    });

    it('should corectly get items by container', function(){

        var textItem = testItems.completeFragmentTextItem,
            imageItem = testItems.completeFragmentImageItem,
            freebaseItem = testItems.completeFreebaseItem;

        ItemsExchange.addItem(textItem, 'myTestContainer');
        ItemsExchange.addItem(imageItem, 'myTestContainer');
        ItemsExchange.addItem(freebaseItem, 'myTestContainer');

        var itemList = ItemsExchange.getItemsByContainer('myTestContainer');

        expect(itemList.length).toBe(3);
        expect(itemList.indexOf(textItem)).toBeGreaterThan(-1);
        expect(itemList.indexOf(imageItem)).toBeGreaterThan(-1);
        expect(itemList.indexOf(freebaseItem)).toBeGreaterThan(-1);

        expect(ItemsExchange.getItemsByContainer('fakeContainer').length).toBe(0);
    });

    it('should corectly get items by filter', function(){

        var textItem = testItems.completeFragmentTextItem,
            imageItem = testItems.completeFragmentImageItem,
            freebaseItem = testItems.completeFreebaseItem;

        ItemsExchange.addItem(textItem);
        ItemsExchange.addItem(imageItem);
        ItemsExchange.addItem(freebaseItem);

        var itemList = ItemsExchange.getItemsBy(function(item){
            if (item.uri === textItem.uri) {
                return true;
            } else {
                return false;
            }
        });

        expect(itemList.length).toBe(1);
        expect(itemList.indexOf(textItem)).toBeGreaterThan(-1);
    });

    it('should corectly get items by filter from container', function(){

        var textItem = testItems.completeFragmentTextItem,
            imageItem = testItems.completeFragmentImageItem,
            freebaseItem = testItems.completeFreebaseItem;

        ItemsExchange.addItem(textItem, 'myTestContainer');
        ItemsExchange.addItem(imageItem, 'myTestContainer');
        ItemsExchange.addItem(freebaseItem);

        var itemList = ItemsExchange.getItemsFromContainerByFilter('myTestContainer', function(item){
            if (item.uri === textItem.uri || item.uri === freebaseItem.uri) {
                return true;
            } else {
                return false;
            }
        });

        expect(itemList.length).toBe(1);
        expect(itemList.indexOf(textItem)).toBeGreaterThan(-1);
        expect(itemList.indexOf(freebaseItem)).toBe(-1);
    });


});