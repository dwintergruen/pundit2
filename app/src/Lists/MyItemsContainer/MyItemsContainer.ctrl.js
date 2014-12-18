angular.module('Pundit2.MyItemsContainer')
.controller('MyItemsContainerCtrl', function($scope, $rootScope, $modal, $timeout, $element,
    MyItemsContainer, ItemsExchange, MyItems, MyPundit, Preview, TypesHelper, PageHandler, 
    TripleComposer, EventDispatcher, Status, Analytics) {

    // read by <item> directive (in Lists/itemList.tmpl.html)
    // specifie how contextual menu type show on item
    $scope.itemMenuType = MyItemsContainer.options.cMenuType;

    // This is the centralized template to dropdown
    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";

    $scope.itemSelected = null;
    $scope.isUseActive = false;

    $scope.canAddItemAsSubject = false;
    $scope.canAddItemAsObject = false;

    var deleteBtn = angular.element($element).find('.my-items-btn-delete'),
        orderBtn = angular.element($element).find('.my-items-btn-order');

    // showed when the items list is empty
    $scope.message = {
        // show or not
        flag: true,
        // text to show
        text: "No my items found."
    };

    $scope.isUserLogged = false;

    $scope.$watch(function(){
        return MyPundit.isUserLogged();
    }, function(logged){
        if (logged) {
            $scope.isUserLogged = true;
            $scope.message.text = "No my items found.";
        } else {
            $scope.isUserLogged = false;
            $scope.message.text = "Please login to see your items.";
        }
    });

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

    var resetContainer = function(){
        $scope.itemSelected = null;
        $scope.isUseActive = false;
        $scope.canAddItemAsSubject = false;
        $scope.canAddItemAsObject = false;
    };


    // set as active a label in contextual menu
    var setLabelActive = function(index) {
        for(var i in $scope.dropdownOrdering){
            $scope.dropdownOrdering[i].isActive = false;
        }
        $scope.dropdownOrdering[index].isActive = true;
    };

    // sort button dropdown content
    $scope.dropdownOrdering = [
        {
            text: 'Label asc',
            click: function(){
                order = 'label';
                $scope.reverse = false;
                setLabelActive(0);
            },
            isActive: order === 'label' && $scope.reverse === false
        },
        {
            text: 'Label desc',
            click: function(){
                order = 'label';
                $scope.reverse = true;
                setLabelActive(1);
            },
            isActive: order === 'label' && $scope.reverse === true
        },
        {
            text: 'Type asc',
            click: function(){
                if ($scope.dropdownOrdering[2].disable) {
                    return;
                }
                order = 'type';
                $scope.reverse = false;
                setLabelActive(2);
            },
            isActive: order === 'type' && $scope.reverse === false
        },
        {
            text: 'Type desc',
            click: function(){
                if ($scope.dropdownOrdering[3].disable) {
                    return;
                }
                order = 'type';
                $scope.reverse = true;
                setLabelActive(3);
            },
            isActive: order === 'type' && $scope.reverse === true
        }
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

    // add page to my items
    $scope.onClickAddPageToMyItems = function(){
        if(!MyPundit.isUserLogged()){
            MyItemsContainer.err('User not logged');
        } else{
            var item = PageHandler.createItemFromPage();
            MyItems.addItem(item);
        }
    };

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
            if (MyPundit.isUserLogged()) {
                $scope.message.text = "No my items found.";
            } else {
                $scope.message.text = "Please login to see your items.";
            }
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
            // TODO Use ng-disable in all MyItems tmpl
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

    modalScope.titleMessage = "Delete all my items";

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
        template: 'src/Core/Templates/confirm.modal.tmpl.html',
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

    $scope.isSelected = function(item) {
        if ($scope.itemSelected !== null && $scope.itemSelected.uri === item.uri) {
            return true;
        } else {
            return false;
        }
    };

    $scope.select = function(item) {
        Preview.setItemDashboardSticky(item);
        EventDispatcher.sendEvent('Pundit.changeSelection');
        
        $scope.isUseActive = true;
        $scope.itemSelected = item;

        $scope.canAddItemAsSubject = TripleComposer.canAddItemAsSubject(item);
        $scope.canAddItemAsObject = TripleComposer.canAddItemAsObject(item);
    };

    $scope.onClickRemove = function() {
        if ($scope.itemSelected === null) {
            return;
        }

        if (Status.getUserStatus() && ItemsExchange.isItemInContainer($scope.itemSelected, MyItems.options.container)) {
            MyItems.deleteItemAndConsolidate($scope.itemSelected);
        }

        resetContainer();
    }

    $scope.onClickUseSubject = function() {
        if ($scope.itemSelected === null) {
            return;
        }

        if (Status.getTemplateModeStatus()) {
            TripleComposer.addToAllSubject($scope.itemSelected);
        } else {
            TripleComposer.addToSubject($scope.itemSelected);
        }

        resetContainer();
    }

    $scope.onClickUseObject = function() {
        if ($scope.itemSelected === null) {
            return;
        }

        TripleComposer.addToObject($scope.itemSelected);

        resetContainer();
    }

    EventDispatcher.addListener('Pundit.changeSelection', function(){
        resetContainer();
    });

});