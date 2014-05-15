angular.module('Pundit2.PageItemsContainer')
.constant('ITEMSCONTAINERDEFAULTS', {

    initialActiveTab: 0,

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/PageItemsContainer/ClientPageItemsContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "Page Items",

    debug: false
})
.service('PageItemsContainer', function(ITEMSCONTAINERDEFAULTS, BaseComponent, TypesHelper) {

    var pageItemsContainer = new BaseComponent('PageItemsContainer', ITEMSCONTAINERDEFAULTS);

    // array of items array, one foreach tab, when activeTab change the showed items change
    // contain all items array (all items array, text items array, image items array and page items array)
    var itemsArrays = [];

    pageItemsContainer.buildItemsArray = function(items, activeTab, tabs) {

        for (var i=0; i<tabs.length; i++) {
            // check if it is my object
            if ( angular.isObject(tabs[i]) && typeof(tabs[i].filterFunction) !== 'undefined' ) {
                // filter items with relative filter function
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


    pageItemsContainer.sortByLabel = function(asc, activeTab){
        if (asc) {
            itemsArrays[activeTab].sort(function(a, b){
                return a.label.localeCompare(b.label);
            });
        } else {
            itemsArrays[activeTab].sort(function(a, b){
                return b.label.localeCompare(a.label);
            });
        }        
    };

    pageItemsContainer.sortByType = function(asc, activeTab){
        if (asc) {
            itemsArrays[activeTab].sort(function(itemA, itemB){
                var aTypeLabel = TypesHelper.getLabel(itemA.type[0]),
                    bTypeLabel = TypesHelper.getLabel(itemB.type[0]);
                return aTypeLabel.localeCompare(bTypeLabel);
            });
        } else {
            itemsArrays[activeTab].sort(function(itemA, itemB){
                var aTypeLabel = TypesHelper.getLabel(itemA.type[0]),
                    bTypeLabel = TypesHelper.getLabel(itemB.type[0]);
                return bTypeLabel.localeCompare(aTypeLabel);
            });
        }
    };

    return pageItemsContainer;

});