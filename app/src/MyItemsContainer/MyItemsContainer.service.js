angular.module('Pundit2.MyItemsContainer')
.constant('MYITEMSCONTAINERDEFAULTS', {

    initialActiveTab: 0,

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/MyItemsContainer/ClientMyItemsContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "My Items",

    // items property used to compare
    order: 'label',
    // how order items (true ascending, false descending)
    reverse: false,

    debug: false
})
.service('MyItemsContainer', function(MYITEMSCONTAINERDEFAULTS, BaseComponent, TypesHelper, ContextualMenu, MyItems) {

    var myItemsContainer = new BaseComponent('MyItemsContainer', MYITEMSCONTAINERDEFAULTS);

    // array of items array, one foreach tab, when activeTab change the showed array change
    // contain all items array (all items array, text items array, image items array and page items array)
    var itemsArrays = [];

    // menu actions relative to item contextual menu (TODO where add action? myItems or pageItems)
    var menuActions = [
        {
            name: 'delteItem',
            type: ['myItemType'],
            label: "Delete This Item",
            priority: 0,
            showIf: function(){
                return true;
            },
            action: function(resource){
                // resource need to be the item to delete
                MyItems.deleteSingleMyItems(resource);
            }
        }
    ];

    ContextualMenu.addAction(menuActions[0]);

    myItemsContainer.buildItemsArray = function(activeTab, tabs, items) {

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

    myItemsContainer.getItemsArrays = function(){
        return itemsArrays;
    };

    return myItemsContainer;

});