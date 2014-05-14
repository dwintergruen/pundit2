angular.module('Pundit2.ItemsContainer')
.controller('ItemsContainerCtrl', function($scope, ItemsExchange) {

    // array of items array, one foreach tab
    // contain all items array, text items array, image items array and page items array
    var itemsArrays = [];

    $scope.tabs = [
        {
            title: 'All Items',
            template: 'src/ItemsContainer/items.tmpl.html',
            filterFunction: function(){
                return true;
            }
        },
        {
            title: 'Text',
            template: 'src/ItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isTextFragment();
            }
        },
        {
            title: 'Images',
            template: 'src/ItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isImage();
            }
        },
        {
            title: 'Pages',
            template: 'src/ItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isWebPage();
            }
        }
    ];

    $scope.tabs.activeTab = 0;

    // every time that change active tab show new items array
    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(activeTab) {
        $scope.displayedItems = itemsArrays[activeTab];
    });

    // every time that user digit text inside <input>
    $scope.$watch(function() {
        return $scope.search;
    }, function(str) {

        if (typeof($scope.displayedItems) === 'undefined') {
            return;
        }

        // this appen when the user delete last char in the <input>
        if (typeof(str) === 'undefined') {
            str = '';
        }

        // filter items actualy showed
        str = str.toLowerCase();
        var strParts = str.split(' ');
            reg = new RegExp(strParts.join('.*'));
        $scope.displayedItems = itemsArrays[$scope.tabs.activeTab].filter(function(items){
            return items.label.toLowerCase().match(reg) !== null;
            // return items.label.toLowerCase().indexOf(str.toLowerCase()) > -1;
        });

    });

    var buildItemsArray = function(items) {

        for (var i=0; i<$scope.tabs.length; i++) {
            if ( angular.isObject($scope.tabs[i]) && typeof($scope.tabs[i].filterFunction) !== 'undefined' ) {
                itemsArrays[i] = items.filter(function(item){
                    return $scope.tabs[i].filterFunction(item);
                });
            }
        }

    };

    $scope.$watch(function() {
        // TODO get items by container
        // return ItemsExchange.getItemsByContainer($scope.container);
        return ItemsExchange.getItems();
    }, function(newItems) {
        // update all items array
        buildItemsArray(newItems);
        // then display new items
        $scope.displayedItems = itemsArrays[$scope.tabs.activeTab];
    }, true);

    console.log('itemsContainer controller run with container: ', $scope.container);

});