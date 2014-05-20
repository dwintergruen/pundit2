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

    xit('should build all items', function(){
        var showed = PageItemsContainer.buildItemsArray(0, tabs, items);
        expect(showed.length).toBe(3);
    });

});