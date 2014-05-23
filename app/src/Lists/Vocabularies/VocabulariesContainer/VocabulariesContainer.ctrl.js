angular.module('Pundit2.Vocabularies')
.constant('VOCABULARIESCONTAINERDEFAULTS', {

    initialActiveTab: 0,

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/Lists/Vocabularies/VocabulariesContainer/ClientVocabulariesContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "Vocab",

    // items property used to compare
    order: 'label',
    // how order items (true ascending, false descending)
    reverse: false,

    // Icons shown in the search input when it's empty and when it has some content
    inputIconSearch: 'pnd-icon-search',
    inputIconClear: 'pnd-icon-times',

    debug: false
})
.controller('VocabulariesContainerCtrl', function($scope, $timeout, BaseComponent, VOCABULARIESCONTAINERDEFAULTS,
                                                    SelectorsManager, ItemsExchange, TypesHelper) {

    var vocabulariesContainer = new BaseComponent('VocabulariesContainer', VOCABULARIESCONTAINERDEFAULTS);

    SelectorsManager.init();

    $scope.dropdownTemplate = "src/Toolbar/dropdown.tmpl.html";
    
    // items property used to compare
    // legal value are: 'type' and 'label'
    var order = vocabulariesContainer.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = vocabulariesContainer.options.reverse;

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
    $scope.tabs.activeTab = vocabulariesContainer.options.initialActiveTab;

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
        icon: vocabulariesContainer.options.inputIconSearch,
        term: ''
    };
    var promise;
    $scope.$watch(function() {
        return $scope.search.term;
    }, function(str) {

        // this happens when the user deletes last char in the <input>
        if (typeof(str) === 'undefined' || str === '') {
            str = '';
            $scope.search.icon = vocabulariesContainer.options.inputIconSearch;
            return;
        } else {
            $scope.search.icon = vocabulariesContainer.options.inputIconClear;
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