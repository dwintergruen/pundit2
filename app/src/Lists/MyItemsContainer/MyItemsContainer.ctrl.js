angular.module('Pundit2.MyItemsContainer')
.controller('MyItemsContainerCtrl', function($scope, $rootScope, $modal, $timeout, $element,
    MyItemsContainer, ItemsExchange, MyItems, MyPundit, Preview, TypesHelper) {

    // read by <item> directive (in Lists/itemList.tmpl.html)
    // specifie how contextual menu type show on item
    $scope.itemMenuType = MyItemsContainer.options.cMenuType;

    // This is the centralized template to dropdown
    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";

    var deleteBtn = angular.element($element).find('.my-items-btn-delete'),
        orderBtn = angular.element($element).find('.my-items-btn-order');

    // showed when the items list is empty
    $scope.message = {
        // show or not
        flag: true,
        // text to show
        text: "No my items found."
    };

    // items property used to compare
    // legal value are: 'type' and 'label'
    var order = MyItemsContainer.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = MyItemsContainer.options.reverse;

    // tabs used to filter items list by type (all, text, image and pages)
    $scope.tabs = [
        {
            title: 'All Items',
            // this is the centralized template to items list
            template: 'src/Lists/itemList.tmpl.html',
            filterFunction: function(){
                return true;
            }
        },
        {
            title: 'Text',
            // this is the centralized template to items list
            template: 'src/Lists/itemList.tmpl.html',
            filterFunction: function(item){
                return item.isTextFragment();
            }
        },
        {
            title: 'Images',
            // this is the centralized template to items list
            template: 'src/Lists/itemList.tmpl.html',
            filterFunction: function(item){
                return item.isImage() || item.isImageFragment();
            }
        },
        {
            title: 'Entities',
            template: 'src/Lists/itemList.tmpl.html',
            filterFunction: function(item){
                return item.isEntity();
            }
        },
        {
            title: 'Pages',
            // this is the centralized template to items list
            template: 'src/Lists/itemList.tmpl.html',
            filterFunction: function(item){
                return item.isWebPage();
            }
        }
    ];

    // index of the active tab (the tab that currently shows its content)
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
            if ($scope.dropdownOrdering[2].disable) {
                return;
            }
            order = 'type';
            $scope.reverse = false;
        }},
        { text: 'Type Desc', click: function(){
            if ($scope.dropdownOrdering[3].disable) {
                return;
            }
            order = 'type';
            $scope.reverse = true;
        }}
    ];

    var removeSpace = function(str){
        return str.replace(/ /g,'');
    };

    // getter function used inside template to order items 
    // returns the items property value used to order
    $scope.getOrderProperty = function(item){

        if (order === 'label') {
            return removeSpace(item.label);
        } else if (order === 'type') {
            return removeSpace(TypesHelper.getLabel(item.type[0]));
        }

    };

    // delete all my Items
    $scope.onClickDeleteAllMyItems = function(){
        openConfirmModal();
    };

    // every time that change active tab show new items array
    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(activeTab) {
        $scope.displayedItems = MyItemsContainer.getItemsArrays()[activeTab];
        // disable sort by type dropdown link
        // enable only in All Items tab
        if ($scope.tabs[activeTab].title !== $scope.tabs[0].title && $scope.tabs[activeTab].title !== $scope.tabs[3].title) {
            $scope.dropdownOrdering[2].disable = true;
            $scope.dropdownOrdering[3].disable = true;
        } else {
            $scope.dropdownOrdering[2].disable = false;
            $scope.dropdownOrdering[3].disable = false;
        }

        if (typeof($scope.displayedItems) !== 'undefined' && typeof($scope.search.term) !== 'undefined') {
            filterItems($scope.search.term);
        }
        
    });

    // Filter items which are shown
    // go to lowerCase and replace multiple space with single space, 
    // to make the regexp work properly
    var filterItems = function(str){
        str = str.toLowerCase().replace(/\s+/g, ' ');
        var strParts = str.split(' '),
            reg = new RegExp(strParts.join('.*'));

        $scope.displayedItems = MyItemsContainer.getItemsArrays()[$scope.tabs.activeTab].filter(function(items){
            return items.label.toLowerCase().match(reg) !== null;
        });

        // update text messagge
        if(str === ''){
            $scope.message.text = "No my items found.";
        } else {
            $scope.message.text = "No item found to: "+str;
        }
    };

    // Every time that user digit text inside <input> filter the items shown.
    // Show only items that contain the $scope.search.term substring inside their label.
    // The match function ignore multiple space
    $scope.search = {
        icon: MyItemsContainer.options.inputIconSearch,
        term: ''
    };
    $scope.$watch(function() {
        return $scope.search.term;
    }, function(str) {

        // any item is currently shown
        if (typeof($scope.displayedItems) === 'undefined') {
            return;
        }

        // this happens when the user deletes last char in the <input>
        if (typeof(str) === 'undefined' || str === '') {
            str = '';
            $scope.search.icon = MyItemsContainer.options.inputIconSearch;
        } else {
            $scope.search.icon = MyItemsContainer.options.inputIconClear;
        }

        filterItems(str);

    });

    // watch only my items
    $scope.$watch(function() {
        return ItemsExchange.getItemsByContainer(MyItems.options.container);
    }, function(newItems) {
        // update all items array and display new items
        $scope.displayedItems = MyItemsContainer.buildItemsArray($scope.tabs.activeTab, $scope.tabs, newItems);
    }, true);

    // watch showed items length
    $scope.$watch(function() {
        return $scope.displayedItems.length;
    }, function(len) {
        // show empty lists messagge
        if (len === 0){
            $scope.message.flag = true;
            deleteBtn.addClass('disabled');
            orderBtn.addClass('disabled');
        } else {
            $scope.message.flag = false;
            deleteBtn.removeClass('disabled');
            orderBtn.removeClass('disabled');
        }

    });

    // confirm modal
    var modalScope = $rootScope.$new();

    modalScope.titleMessage = "Delete All My Items"

    // confirm btn click
    modalScope.confirm = function() {
        if (MyPundit.isUserLogged()) {
            MyItems.deleteAllItems().then(function(){
                modalScope.notifyMessage = "Success, my items correctly deleted.";
            }, function(){
                modalScope.notifyMessage = "Error impossible to delete my items, please retry.";
            });
        }
        $timeout(function(){
            confirmModal.hide();
        }, 1000);
    };

    // cancel btn click
    modalScope.cancel = function() {
        confirmModal.hide();
    };

    var confirmModal = $modal({
        container: "[data-ng-app='Pundit2']",
        template: 'src/Core/confirm.modal.tmpl.html',
        show: false,
        backdrop: 'static',
        scope: modalScope
    });

    // open modal
    var openConfirmModal = function(){
        // promise is needed to open modal when template is ready
        modalScope.notifyMessage = "Are you sure you want to delete all my items? After you can no longer recover.";
        confirmModal.$promise.then(confirmModal.show);
    };

});