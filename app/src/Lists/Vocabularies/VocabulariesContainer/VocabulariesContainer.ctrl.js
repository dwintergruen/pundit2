angular.module('Pundit2.Vocabularies')
.controller('VocabulariesContainerCtrl', function($scope, $timeout, VocabulariesContainer, SelectorsManager, ItemsExchange, TypesHelper) {

    $scope.dropdownTemplate = "src/Toolbar/dropdown.tmpl.html";
    
    // items property used to compare
    // legal value are: 'type' and 'label'
    var order = VocabulariesContainer.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = VocabulariesContainer.options.reverse;

    // build tabs by reading active selectors inside selectors manager
    $scope.tabs = [];
    var selectors = SelectorsManager.getActiveSelectors();
    for (var name in selectors) {
        $scope.tabs.push({
            title: name,
            template: 'src/Lists/itemList.tmpl.html',
            itemsContainer: selectors[name].options.container
        });
    }

    // index of the active tab (the tab that actualy show it content) 
    $scope.tabs.activeTab = VocabulariesContainer.options.initialActiveTab;

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

    $scope.search = {
        icon: VocabulariesContainer.options.inputIconSearch,
        term: ''
    };
    var promise;
    $scope.$watch(function() {
        return $scope.search.term;
    }, function(str) {

        // this happens when the user deletes last char in the <input>
        if (typeof(str) === 'undefined' || str === '') {
            str = '';
            $scope.search.icon = VocabulariesContainer.options.inputIconSearch;
            return;
        } else {
            $scope.search.icon = VocabulariesContainer.options.inputIconClear;
        }

        // need to query vocab then update showed items
        $timeout.cancel(promise);
        promise = $timeout(function(){
            querySelectors();
        }, 300);        

    });

    var querySelectors = function(){
        var callback = function(){
            console.log('all selectors complete quering', ItemsExchange.getAll());
        }
        SelectorsManager.getItems($scope.search.term, callback);
    };

    $scope.$watch(function() {
        return ItemsExchange.getItemsByContainer($scope.tabs[$scope.tabs.activeTab].itemsContainer);
    }, function(newItems) {
        // update all items array and display new items
        $scope.displayedItems = newItems;
    }, true);

});