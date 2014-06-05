angular.module('Pundit2.Vocabularies')
.constant('VOCABULARIESCONTAINERDEFAULTS', {

    /**
     * @module punditConf
     * @ngdoc property
     * @name modules#VocabulariesContainer
     *
     * @description
     * `object`
     *
     * Configuration for VocabulariesContainer module
     */

    /**
     * @module punditConf
     * @ngdoc property
     * @name modules#VocabulariesContainer.order
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
     * @module punditConf
     * @ngdoc property
     * @name modules#VocabulariesContainer.reverse
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
     * @module punditConf
     * @ngdoc property
     * @name modules#VocabulariesContainer.initialActiveTab
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
     * @module punditConf
     * @ngdoc property
     * @name modules#VocabulariesContainer.inputIconSearch
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
     * @module punditConf
     * @ngdoc property
     * @name modules#VocabulariesContainer.inputIconClear
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
.controller('VocabulariesContainerCtrl', function($scope, $timeout, $injector, BaseComponent, VOCABULARIESCONTAINERDEFAULTS,
                                                    SelectorsManager, ItemsExchange, TypesHelper) {

    var vocabulariesContainer = new BaseComponent('VocabulariesContainer', VOCABULARIESCONTAINERDEFAULTS);

    // SelectorsManager is initialized inside client.boot()

    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";

    $scope.message = {
        flag: true,
        text: "I'm a welcome message"
    };

    // read by <item> directive (in Lists/itemList.tmpl.html)
    // will trigger this contextual menu type clicking on the contextual item icon
    $scope.itemMenuType = SelectorsManager.options.cMenuType;
    
    // items property used to compare
    // legal value are: 'type' and 'label'
    var order = vocabulariesContainer.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = vocabulariesContainer.options.reverse;

    // build tabs by reading active selectors inside selectors manager
    $scope.tabs = [];
    var selectors = SelectorsManager.getActiveSelectors();
    for (var j in selectors) {
        $scope.tabs.push({
            title: selectors[j].config.label,
            template: 'src/Lists/itemList.tmpl.html',
            itemsContainer: selectors[j].config.container
        });
    }

    // index of the active tab (the tab that actualy show it content) 
    $scope.tabs.activeTab = vocabulariesContainer.options.initialActiveTab;

    // sort button dropdown content
    $scope.dropdownOrdering = [
        { text: 'Label Asc', click: function(){
            order = 'label';
            $scope.reverse = false;
        }},
        { text: 'Label Desc', click: function(){
            order = 'label';
            $scope.reverse = true;
        }},
        { text: 'Type Asc', click: function(){
            order = 'type';
            $scope.reverse = false;
        }},
        { text: 'Type Desc', click: function(){
            order = 'type';
            $scope.reverse = true;
        }}
    ];

    var removeSpace = function(str){
        return str.replace(/ /g,'');
    };

    // getter function used inside template to order items 
    // return the items property value used to order
    $scope.getOrderProperty = function(item){

        if (order === 'label') {
            return removeSpace(item.label);
        } else if (order === 'type') {
            return removeSpace(TypesHelper.getLabel(item.type[0]));
        }

    };

    $scope.search = {
        icon: vocabulariesContainer.options.inputIconSearch,
        term: ''
    };
    var promise;
    $scope.$watch(function() {
        return $scope.search.term;
    }, function(str) {

        // this happens when the user deletes last char in the <input>
        if (typeof(str) === 'undefined' || str === '') {
            str = '';
            $scope.search.icon = vocabulariesContainer.options.inputIconSearch;
            $timeout.cancel(promise);
            return;
        } else {
            $scope.search.icon = vocabulariesContainer.options.inputIconClear;
        }

        // need to query vocab then update showed items
        $timeout.cancel(promise);
        promise = $timeout(function(){
            querySelectors();
        }, 500);               

    });

    var updateMessage = function(){
        vocabulariesContainer.log('All selectors end http calls'/*, ItemsExchange.getAll()*/);
        if ($scope.displayedItems.length === 0 && $scope.search.term!=='' && typeof($scope.search.term)!=='undefined') {
            $scope.message.text = "No item found to: "+$scope.search.term;
        }
    };

    var querySelectors = function(){
        SelectorsManager.getItems($scope.search.term).then(
            function(){
                updateMessage();
            }, function(){
                updateMessage();
            });
    };

    $scope.$watch(function() {
        return ItemsExchange.getItemsByContainer($scope.tabs[$scope.tabs.activeTab].itemsContainer);
    }, function(newItems) {
        // update all items array and display new items
        $scope.displayedItems = newItems;
        if ($scope.displayedItems.length === 0) {
            $scope.message.flag = true;
        } else {
            $scope.message.flag = false;
        }
    }, true);

    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(newActive, oldActive) {
        if (newActive !== oldActive)
            updateMessage();
    });

});