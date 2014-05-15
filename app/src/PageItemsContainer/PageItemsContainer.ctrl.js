angular.module('Pundit2.PageItemsContainer')
.controller('PageItemsContainerCtrl', function($scope, PageItemsContainer, ItemsExchange, Preview) {

    $scope.tabs = [
        {
            title: 'All Items',
            template: 'src/PageItemsContainer/items.tmpl.html',
            filterFunction: function(){
                return true;
            }
        },
        {
            title: 'Text',
            template: 'src/PageItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isTextFragment();
            }
        },
        {
            title: 'Images',
            template: 'src/PageItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isImage();
            }
        },
        {
            title: 'Pages',
            template: 'src/PageItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isWebPage();
            }
        }
    ];

    $scope.dropdownOrdering = [
        { text: 'Asc', click: function(){
            PageItemsContainer.sortByLabel(true, $scope.tabs.activeTab);
        }},
        { text: 'Desc', click: function(){
            PageItemsContainer.sortByLabel(false, $scope.tabs.activeTab);
        }},
        { text: 'Type Asc', click: function(){
            PageItemsContainer.sortByType(true, $scope.tabs.activeTab);
        }},
        { text: 'Type Desc', click: function(){
            PageItemsContainer.sortByType(false, $scope.tabs.activeTab);
        }}
    ];

    $scope.tabs.activeTab = PageItemsContainer.options.initialActiveTab;

    // every time that change active tab show new items array
    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(activeTab) {
        $scope.displayedItems = PageItemsContainer.getItemsArrays()[activeTab];
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

        // go to lowerCase and replace multiple space with single space
        str = str.toLowerCase().replace(/\s+/g, ' ');
        var strParts = str.split(' ');
            reg = new RegExp(strParts.join('.*'));
        $scope.displayedItems = PageItemsContainer.getItemsArrays()[$scope.tabs.activeTab].filter(function(items){
            return items.label.toLowerCase().match(reg) !== null;
            // return items.label.toLowerCase().indexOf(str.toLowerCase()) > -1;
        });

    });

    $scope.$watch(function() {
        // TODO get items by container
        // return ItemsExchange.getItemsByContainer($scope.container);
        return ItemsExchange.getItems();
    }, function(newItems) {
        // update all items array and display new items
        $scope.displayedItems = PageItemsContainer.buildItemsArray(newItems, $scope.tabs.activeTab, $scope.tabs);
    }, true);

    $scope.onItemsMouseOver = function(item){
        Preview.showDashboardPreview(item);
    }

    console.log('itemsContainer controller run with container: ', $scope.container);

});