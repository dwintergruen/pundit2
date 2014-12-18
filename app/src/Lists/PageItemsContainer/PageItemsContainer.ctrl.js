angular.module('Pundit2.PageItemsContainer')
.controller('PageItemsContainerCtrl', function($scope, $element,
    PageItemsContainer, ItemsExchange, Preview, TypesHelper,
    MyItems, TripleComposer, EventDispatcher, Status) {

    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";

    $scope.itemSelected = null;
    $scope.isUseActive = false;

    $scope.canAddItemAsSubject = false;
    $scope.canAddItemAsObject = false;

    $scope.isUserLogged = false;

    // read by <item> directive (in PageItemsContainer/items.tmpl.html)
    // will trigger this contextual menu type clicking on the contextual item icon
    $scope.itemMenuType = PageItemsContainer.options.cMenuType;

    var orderBtn = angular.element($element).find('.page-items-btn-order');

    $scope.message = {
        flag: true,
        text: "No page items found."
    };

    // items property used to compare
    // legal value are: 'type' and 'label'
    var order = PageItemsContainer.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = PageItemsContainer.options.reverse;

    // tabs used to filter items list by type (all, text, image and pages)
    $scope.tabs = [
        {
            title: 'All items',
            template: 'src/Lists/itemList.tmpl.html',
            filterFunction: function(){
                return true;
            }
        },
        {
            title: 'Text',
            template: 'src/Lists/itemList.tmpl.html',
            filterFunction: function(item){
                return item.isTextFragment();
            }
        },
        {
            title: 'Images',
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
            template: 'src/Lists/itemList.tmpl.html',
            filterFunction: function(item){
                return item.isWebPage();
            }
        }
    ];

    // index of the active tab (the tab that actualy show it content) 
    $scope.tabs.activeTab = PageItemsContainer.options.initialActiveTab;

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
    // return the items property value used to order
    $scope.getOrderProperty = function(item){

        if (order === 'label') {
            return removeSpace(item.label);
        } else if (order === 'type') {
            return removeSpace(TypesHelper.getLabel(item.type[0]));
        }

    };

    // Filter items which are shown
    // go to lowerCase and replace multiple space with single space, 
    // to make the regexp work properly
    var filterItems = function(str){

        str = str.toLowerCase().replace(/\s+/g, ' ');
        var strParts = str.split(' '),
            reg = new RegExp(strParts.join('.*'));

        $scope.displayedItems = PageItemsContainer.getItemsArrays()[$scope.tabs.activeTab].filter(function(items){
            return items.label.toLowerCase().match(reg) !== null;
        });

        // update text messagge
        if(str === ''){
            $scope.message.text = "No page items found.";
        } else {
            $scope.message.text = "No item found to: "+str;
        }
    };

    // every time that change active tab show new items array
    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(activeTab) {
        $scope.displayedItems = PageItemsContainer.getItemsArrays()[activeTab];
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

    // every time that user digit text inside <input> filter the items showed
    // show only items that contain the $scope.search substring inside their label
    // the match function ignore multiple spaces
    $scope.search = {
        icon: PageItemsContainer.options.inputIconSearch,
        term: ''
    };
    $scope.$watch(function() {
        return $scope.search.term;
    }, function(str) {

        // All items are shown
        if (typeof($scope.displayedItems) === 'undefined') {
            return;
        }

        // this happens when the user deletes last char in the <input>
        if (typeof(str) === 'undefined' || str === '') {
            str = '';
            $scope.search.icon = PageItemsContainer.options.inputIconSearch;
        } else {
            $scope.search.icon = PageItemsContainer.options.inputIconClear;
        }

        filterItems(str);

    });

    $scope.$watch(function() {
        return ItemsExchange.getItemsByContainer(PageItemsContainer.options.container);
    }, function(newItems) {
        // update all items array and display new items
        $scope.displayedItems = PageItemsContainer.buildItemsArray($scope.tabs.activeTab, $scope.tabs, newItems);
    }, true);

    $scope.$watch(function() {
        return $scope.displayedItems.length;
    }, function(len) {
        // show empty lists messagge
        if (len === 0){
            $scope.message.flag = true;
            orderBtn.addClass('disabled');
        } else {
            $scope.message.flag = false;
            orderBtn.removeClass('disabled');
        }
    });

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

    $scope.onClickAdd = function() {
        if ($scope.itemSelected === null) {
            return;
        }

        if (Status.getUserStatus() && !ItemsExchange.isItemInContainer($scope.itemSelected, MyItems.options.container)) {
            MyItems.addItemAndConsolidate($scope.itemSelected);
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

    EventDispatcher.addListener('MyPundit.isUserLogged', function(e) {
        $scope.isUserLogged = e.args;
    });

});