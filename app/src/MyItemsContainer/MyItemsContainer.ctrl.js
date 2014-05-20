angular.module('Pundit2.MyItemsContainer')
.controller('MyItemsContainerCtrl', function($scope, MyItemsContainer, ItemsExchange, MyItems, Preview, TypesHelper) {

    // read by <item> directive (in PageItemsContainer/items.tmpl.html)
    // specifie how contextual menu type show on item
    $scope.itemMenuType = MyItemsContainer.options.myItemsMenuType;

    // This is the centralized template to dropdown
    $scope.dropdownTemplate = "src/Toolbar/dropdown.tmpl.html";

    // items property used to compare
    // legal value are: 'type' and 'label'
    var order = MyItemsContainer.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = MyItemsContainer.options.reverse;

    // tabs used to filter items list by type (all, text, image and pages)
    $scope.tabs = [
        {
            title: 'All Items',
            // this is the centalized template to items list
            template: 'src/PageItemsContainer/items.tmpl.html',
            filterFunction: function(){
                return true;
            }
        },
        {
            title: 'Text',
            // this is the centalized template to items list
            template: 'src/PageItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isTextFragment();
            }
        },
        {
            title: 'Images',
            // this is the centalized template to items list
            template: 'src/PageItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isImage();
            }
        },
        {
            title: 'Pages',
            // this is the centalized template to items list
            template: 'src/PageItemsContainer/items.tmpl.html',
            filterFunction: function(item){
                return item.isWebPage();
            }
        }
    ];

    // index of the active tab (the tab that actualy show it content) 
    $scope.tabs.activeTab = MyItemsContainer.options.initialActiveTab;

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

    // delte all my Items
    $scope.onClickDeleteAllMyItems = function(){
        MyItems.deleteAllMyItems();
    };

    // every time that change active tab show new items array
    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(activeTab) {
        $scope.displayedItems = MyItemsContainer.getItemsArrays()[activeTab];
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

        // any item is actualy showed
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

        $scope.displayedItems = MyItemsContainer.getItemsArrays()[$scope.tabs.activeTab].filter(function(items){
            return items.label.toLowerCase().match(reg) !== null;
        });

    });

    var myItemsCont = MyItems.getMyItemsContainer();
    // watch only my items
    $scope.$watch(function() {
        return ItemsExchange.getItemsByContainer(myItemsCont);
    }, function(newItems) {
        // update all items array and display new items
        $scope.displayedItems = MyItemsContainer.buildItemsArray($scope.tabs.activeTab, $scope.tabs, newItems);
    }, true);

});