angular.module('Pundit2.Vocabularies')
.controller('VocabulariesContainerCtrl', function($scope, $timeout, $injector, $element, $q, BaseComponent,
                                                    SelectorsManager, ItemsExchange, TypesHelper) {

    // SelectorsManager is initialized inside client.boot()

    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";

    var orderBtn = angular.element($element).find('.vocab-items-btn-order');

    $scope.message = {
        flag: true,
        text: "Enter text to search in the vocabularies."
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
            text: 'Label Asc', 
            click: function(){
                order = 'label';
                $scope.reverse = false;
                setLabelActive(0);
            },
            isActive: order === 'label' && $scope.reverse === false
        },
        { 
            text: 'Label Desc', 
            click: function(){
                order = 'label';
                $scope.reverse = true;
                setLabelActive(1);
            },
            isActive: order === 'label' && $scope.reverse === true
        },
        { 
            text: 'Type Asc', 
            click: function(){
                order = 'type';
                $scope.reverse = false;
                setLabelActive(2);
            },
            isActive: order === 'type' && $scope.reverse === false
        },
        { 
            text: 'Type Desc', 
            click: function(){
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

    $scope.displayedItems = [];
    var updateMessage = function(){
        if ($scope.displayedItems.length === 0 && $scope.search.term!=='' && typeof($scope.search.term)!=='undefined') {
            $scope.message.text = "No item found to: "+$scope.search.term;
        }
    };

    // this promise is resolved when we make a new search
    // and we no longer need the items related to previous research
    var queryPromise = null,
        actualContainer;
    // make a new research
    var querySelectors = function(){
        if (queryPromise !== null) {
            queryPromise.resolve();
        }
        queryPromise = $q.defer();
        SelectorsManager.getItems($scope.search.term, queryPromise.promise).then(
            function(){
                updateMessage();
            }, function(){
                updateMessage();
            });
        actualContainer = $scope.tabs[$scope.tabs.activeTab].itemsContainer + $scope.search.term.split(' ').join('$');
    };

    $scope.$watch(function() {
            return ItemsExchange.getItemsByContainer(actualContainer);
    }, function(newItems) {
        // update all items array and display new items
        $scope.displayedItems = newItems;
        if ($scope.displayedItems.length === 0) {
            $scope.message.flag = true;
            orderBtn.addClass('disabled');
        } else {
            $scope.message.flag = false;
            orderBtn.removeClass('disabled');
        }
    }, true);

    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function(newActive, oldActive) {
        if (newActive !== oldActive){
            actualContainer = $scope.tabs[$scope.tabs.activeTab].itemsContainer + $scope.search.term.split(' ').join('$');
            updateMessage();
        }            
    });

});