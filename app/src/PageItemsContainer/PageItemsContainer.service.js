angular.module('Pundit2.PageItemsContainer')
.constant('ITEMSCONTAINERDEFAULTS', {

    initialActiveTab: 0,

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/PageItemsContainer/ClientPageItemsContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "Page Items",

    // items property used to compare
    order: 'label',
    // how order items (true ascending, false descending)
    reverse: false,

    debug: false
})
.service('PageItemsContainer', function(ITEMSCONTAINERDEFAULTS, BaseComponent, TypesHelper) {

    var pageItemsContainer = new BaseComponent('PageItemsContainer', ITEMSCONTAINERDEFAULTS);

    // array of items array, one foreach tab, when activeTab change the showed array change
    // contain all items array (all items array, text items array, image items array and page items array)
    var itemsArrays = [];

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