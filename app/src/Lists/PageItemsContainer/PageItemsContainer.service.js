angular.module('Pundit2.PageItemsContainer')
.constant('PAGEITEMSCONTAINERDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer
     *
     * @description
     * `object`
     *
     * Configuration for PageItemsContainer module. Defines: at which dashboard panel add the 
     * PageItemsContainer directive, the type of the context menu opened on items, 
     * the directive template path and a lot of others parameters of the directive.
     */

     /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.clientDashboardTemplate
     *
     * @description
     * `string`
     *
     * Path of template containing myItemsContainer directive, client will append the content of this template 
     * to the DOM (inside dashboard directive) to bootstrap this component
     *
     * Default value:
     * <pre> clientDashboardTemplate: "src/Lists/PageItemsContainer/ClientPageItemsContainer.tmpl.html" </pre>
     */
    clientDashboardTemplate: "src/Lists/PageItemsContainer/ClientPageItemsContainer.tmpl.html",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.clientDashboardPanel
     *
     * @description
     * `string`
     *
     * Name of the panel where append the directive (legal value to default are: 'lists', 'tools' and 'details')
     *
     * Default value:
     * <pre> clientDashboardPanel: "lists" </pre>
     */
    clientDashboardPanel: "lists",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.clientDashboardTabTitle
     *
     * @description
     * `string`
     *
     * Tab title inside panel dashboard tabs
     *
     * Default value:
     * <pre> clientDashboardTabTitle: "Page Items" </pre>
     */
    clientDashboardTabTitle: "Page Items",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.initialActiveTab
     *
     * @description
     * `number`
     *
     * Default displayed tab
     *
     * Default value:
     * <pre> initialActiveTab: 0 </pre>
     */
    initialActiveTab: 0,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.cMenuType
     *
     * @description
     * `string`
     *
     * Contextual menu type showed by items contained inside directive
     *
     * Default value:
     * <pre> cMenuType: 'pageItems' </pre>
     */
    cMenuType: 'pageItems',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.order
     *
     * @description
     * `string`
     *
     * Default items property used to sort items list inside directive (legal value are: 'label' and 'type')
     *
     * Default value:
     * <pre> order: 'label' </pre>
     */
    order: 'label',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.reverse
     *
     * @description
     * `boolean`
     *
     * Default items ordering inside directive (true: ascending, false: descending)
     *
     * Default value:
     * <pre> reverse: false </pre>
     */
    reverse: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.container
     *
     * @description
     * `string`
     *
     * Name of the container used to store the page items in the itemsExchange (TODO link)
     *
     * Default value:
     * <pre> container: 'myItems' </pre>
     */
    container: 'pageItems',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.inputIconSearch
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it's empty
     *
     * Default value:
     * <pre> inputIconSearch: 'pnd-icon-search' </pre>
     */
    inputIconSearch: 'pnd-icon-search',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.inputIconClear
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it has some content
     *
     * Default value:
     * <pre> inputIconClear: 'pnd-icon-times' </pre>
     */
    inputIconClear: 'pnd-icon-times',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageItemsContainer.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false
    
})
.service('PageItemsContainer', function(PAGEITEMSCONTAINERDEFAULTS, BaseComponent, TypesHelper,
                                        ContextualMenu, MyPundit, ItemsExchange) {

    var pageItemsContainer = new BaseComponent('PageItemsContainer', PAGEITEMSCONTAINERDEFAULTS);

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