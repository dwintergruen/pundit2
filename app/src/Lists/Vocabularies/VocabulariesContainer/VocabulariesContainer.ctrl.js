angular.module('Pundit2.Vocabularies')
.controller('VocabulariesContainerCtrl', function($scope, $timeout, $injector, BaseComponent,
                                                    SelectorsManager, ItemsExchange, TypesHelper) {

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
    var order = SelectorsManager.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = SelectorsManager.options.reverse;

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
    $scope.tabs.activeTab = SelectorsManager.options.initialActiveTab;

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
        icon: SelectorsManager.options.inputIconSearch,
        term: ''
    };
    var promise;
    $scope.$watch(function() {
        return $scope.search.term;
    }, function(str) {

        // this happens when the user deletes last char in the <input>
        if (typeof(str) === 'undefined' || str === '') {
            str = '';
            $scope.search.icon = SelectorsManager.options.inputIconSearch;
            $timeout.cancel(promise);
            return;
        } else {
            $scope.search.icon = SelectorsManager.options.inputIconClear;
        }

        // need to query vocab then update showed items
        $timeout.cancel(promise);
        promise = $timeout(function(){
            querySelectors();
        }, 500);               

    });

    var updateMessage = function(){
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