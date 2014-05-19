angular.module('Pundit2.PageItemsContainer')
.constant('PAGEITEMSCONTAINERDEFAULTS', {

    initialActiveTab: 0,

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/PageItemsContainer/ClientPageItemsContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "Page Items",

    // page items contextual menu type
    pageItemsMenuType: 'pageItems',

    // items property used to compare
    order: 'label',
    // how order items (true ascending, false descending)
    reverse: false,

    debug: false
})
.service('PageItemsContainer', function(PAGEITEMSCONTAINERDEFAULTS, BaseComponent, TypesHelper, ContextualMenu, MyItems, ItemsExchange) {

    var pageItemsContainer = new BaseComponent('PageItemsContainer', PAGEITEMSCONTAINERDEFAULTS);

    // array of items array, one foreach tab, when activeTab change the showed array change
    // contain all items array (all items array, text items array, image items array and page items array)
    var itemsArrays = [];

    // menu actions relative to pageItem contextual menu
    var menuActions = [
        {
            name: 'addToMyItems',
            type: [pageItemsContainer.options.pageItemsMenuType],
            label: "Add To My Items",
            priority: 0,
            showIf: function(resource){
                
                var myItemsCont = MyItems.getMyItemsContainer();
                var items = ItemsExchange.getItemsByContainer(myItemsCont);

                return items.indexOf(resource) === -1;
            },
            action: function(resource){
                // TODO add myItems API to add item to pundit server
            }
        }
    ];

    ContextualMenu.addAction(menuActions[0]);

    pageItemsContainer.buildItemsArray = function(activeTab, tabs, items) {

        // forEach tab build the relative items array
        // using the tab filter function
        for (var i=0; i<tabs.length; i++) {
            // check if it have the filter function
            if ( angular.isObject(tabs[i]) && typeof(tabs[i].filterFunction) !== 'undefined' ) {
                // filter all items to obtain the specific tab array
                itemsArrays[i] = items.filter(function(item){
                    return tabs[i].filterFunction(item);
                });
            }
        }

        return itemsArrays[activeTab];
    };

    pageItemsContainer.getItemsArrays = function(){
        return itemsArrays;
    };

    return pageItemsContainer;

});