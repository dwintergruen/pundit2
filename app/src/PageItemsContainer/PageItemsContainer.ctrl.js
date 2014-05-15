angular.module('Pundit2.PageItemsContainer')
.controller('PageItemsContainerCtrl', function($scope, PageItemsContainer, ItemsExchange, Preview, TypesHelper) {

    $scope.dropdownTemplate = "src/Toolbar/dropdown.tmpl.html";

    // how items property is compare to sort
    // legal value are: 'type', 'label'
    var order = PageItemsContainer.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = PageItemsContainer.options.reverse;

    // items tabs used to filter items list
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

    // index of the active tab inside $scope.tabs 
    $scope.tabs.activeTab = PageItemsContainer.options.initialActiveTab;

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

    // getter function used to order items inside template
    // return the items property value used to order
    $scope.getOrderProperty = function(item){

        if (order === 'label') {
            return removeSpace(item.label);
        } else if (order === 'type') {
            return removeSpace(TypesHelper.getLabel(item.type[0]));
        }

    };

    // every time that change active tab show new items array
    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(activeTab) {
        $scope.displayedItems = PageItemsContainer.getItemsArrays()[activeTab];
        // disable sort by type dropdown link
        // enable only in All Items tab
        if ($scope.tabs[activeTab].title !== $scope.tabs[0].title) {
            $scope.dropdownOrdering[2].disable = true;
            $scope.dropdownOrdering[3].disable = true;
        } else {
            $scope.dropdownOrdering[2].disable = false;
            $scope.dropdownOrdering[3].disable = false;
        }
    });

    // every time that user digit text inside <input> filter the items showed
    // show only items that contain the $scope.search substring inside their label
    // the match function ignore multiple space
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
        $scope.displayedItems = PageItemsContainer.buildItemsArray($scope.tabs.activeTab, $scope.tabs, newItems);
    }, true);

    $scope.onItemsMouseOver = function(item){
        Preview.showDashboardPreview(item);
    }

    console.log('itemsContainer controller run with container: ', $scope.container);

});