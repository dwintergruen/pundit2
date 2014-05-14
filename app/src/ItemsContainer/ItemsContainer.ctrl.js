angular.module('Pundit2.ItemsContainer')
.controller('ItemsContainerCtrl', function($scope, ItemsExchange) {

    var itemsArrays = [];

    $scope.tabs = [
        {
            title: 'All Items',
            template: 'src/ItemsContainer/items.tmpl.html'
        },
        {
            title: 'Text',
            template: 'src/ItemsContainer/items.tmpl.html'
        },
        {
            title: 'Images',
            template: 'src/ItemsContainer/items.tmpl.html'
        },
        {
            title: 'Pages',
            template: 'src/ItemsContainer/items.tmpl.html'
        }
    ];

    // initialy show all items
    $scope.tabs.activeTab = 0;

    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(activeTab) {
        $scope.displayedItems = itemsArrays[activeTab];
    });

    $scope.$watch(function() {
        return $scope.search;
    }, function(str) {

        if (typeof($scope.displayedItems) === 'undefined') {
            return;
        }

        if (typeof(str) === 'undefined') {
            str = '';
        }

        // filter items actualy showed
        $scope.displayedItems = itemsArrays[$scope.tabs.activeTab].filter(function(items){
            return items.label.indexOf(str) > -1;
        });
        
    });

    var buildItemsArray = function(items) {
        
        itemsArrays[0] = items;

        itemsArrays[1] = items.filter(function(item){
            return item.isTextFragment();
        });

        itemsArrays[2] = items.filter(function(item){
            return item.isImage();
        });

        itemsArrays[3] = items.filter(function(item){
            return item.isWebPage();
        });

    };

    $scope.$watch(function() {
        // TODO get items by container
        // return ItemsExchange.getItemsByContainer($scope.container);
        return ItemsExchange.getItems();
    }, function(newItems) {
        // update all items array
        buildItemsArray(newItems);
        // than display new items
        $scope.displayedItems = itemsArrays[$scope.tabs.activeTab];
        //console.log(newItems, allItems, textItems, imageItems, pageItems);
    }, true);

    console.log('itemsContainer controller run with container: ', $scope.container);

});