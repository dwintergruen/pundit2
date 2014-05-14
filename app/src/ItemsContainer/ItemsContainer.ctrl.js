angular.module('Pundit2.ItemsContainer')
.controller('ItemsContainerCtrl', function($scope, ItemsExchange) {

    var allItems,
        textItems,
        imageItems,
        pageItems;

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

    // initialy display all items
    $scope.tabs.activeTab = 0;

    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(activeTab) {
        updateDisplayed(activeTab);
        console.log(activeTab);
    });

    var buildItemsArray = function(itemsArray) {
        
        allItems = itemsArray;

        /*textItems = itemsArray.filter(function(item){
            return item.isTextFragment();
        });*/

        imageItems = itemsArray.filter(function(item){
            return item.isImage();
        });

        pageItems = itemsArray.filter(function(item){
            return item.isWebPage();
        });

    };

    var updateDisplayed = function(active) {
        switch (active) {
            // all items
            case 0:
                $scope.displayedItems = allItems;
                break;
            // text items
            case 1:
                $scope.displayedItems = textItems;
                break;
            // image items
            case 2:
                $scope.displayedItems = imageItems;
                break;
            // page items
            case 3:
                $scope.displayedItems = pageItems;
                break;
        }
    };

    $scope.$watch(function() {
        return ItemsExchange.getItems();
    }, function(newItems) {
        // update all items array
        buildItemsArray(newItems);
        // than display new items
        updateDisplayed($scope.tabs.activeTab);
        //console.log(newItems, allItems, textItems, imageItems, pageItems);
    }, true);

    console.log('itemsContainer controller run with container: ', $scope.container);

});