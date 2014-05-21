describe('ItemsContainer (page item and my item)', function() {

    // This test the buildItemsArray common to PageItemsContainer and MyItemsContainer services

    var PageItemsContainer,
        MyItemsContainer;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_PageItemsContainer_, _MyItemsContainer_){
        PageItemsContainer = _PageItemsContainer_;
        MyItemsContainer = _MyItemsContainer_;
    }));

    var tabs = [
        {
            title: 'tab1',
            filterFunction: function(){
                return true;
            }
        },
        {
            title: 'tab2',
            filterFunction: function(item){
                return item.isTextFragment();
            }
        }
    ];

    var items = [
        { uri: 'item1', isTextFragment: function(){return true;}},
        { uri: 'item2', isTextFragment: function(){return false;}},
        { uri: 'item3', isTextFragment: function(){return false;}}
    ];


    it('should correctly build items array that pass filtering (PageItemsContainer)', function(){
        var showed = PageItemsContainer.buildItemsArray(1, tabs, items);
        expect(showed.length).toBe(1);
        expect(showed[0].title).toBe(items[0].title);
    });

    it('should correctly build all items arrays (PageItemsContainer)', function(){
        var showed = PageItemsContainer.buildItemsArray(0, tabs, items);
        expect(showed.length).toBe(3);

        var arrays = PageItemsContainer.getItemsArrays();
        expect(arrays.length).toBe(2);
        expect(arrays[1].length).toBe(1);
    });

    // same test on MyItemsContainer

    it('should correctly build items array that pass filtering (MyItemsContainer)', function(){
        var showed = MyItemsContainer.buildItemsArray(1, tabs, items);
        expect(showed.length).toBe(1);
        expect(showed[0].title).toBe(items[0].title);
    });

    it('should correctly build all items arrays (MyItemsContainer)', function(){
        var showed = MyItemsContainer.buildItemsArray(0, tabs, items);
        expect(showed.length).toBe(3);

        var arrays = MyItemsContainer.getItemsArrays();
        expect(arrays.length).toBe(2);
        expect(arrays[1].length).toBe(1);
    });

});