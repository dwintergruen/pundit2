angular.module('Pundit2.Vocabularies')
.controller('VocabulariesContainerCtrl', function($scope, VocabulariesContainer, ItemsExchange, Preview, TypesHelper) {

    $scope.dropdownTemplate = "src/Toolbar/dropdown.tmpl.html";
    

    // items property used to compare
    // legal value are: 'type' and 'label'
    var order = VocabulariesContainer.options.order;

    // how order items, true is ascending, false is descending
    $scope.reverse = VocabulariesContainer.options.reverse;

    // tabs
    $scope.tabs = [
        {
            title: 'Freebase',
            template: 'src/Lists/itemList.tmpl.html'
        },
        {
            title: 'Muruca',
            template: 'src/Lists/itemList.tmpl.html'
        },
        {
            title: 'DbPedia',
            template: 'src/Lists/itemList.tmpl.html'
        }
    ];

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

    // every time that user digit text inside <input> filter the items showed
    // show only items that contain the $scope.search substring inside their label
    // the match function ignore multiple spaces
    $scope.search = {
        icon: VocabulariesContainer.options.inputIconSearch,
        term: ''
    };
    $scope.$watch(function() {
        return $scope.search.term;
    }, function(str) {

        // this happens when the user deletes last char in the <input>
        if (typeof(str) === 'undefined' || str === '') {
            str = '';
            $scope.search.icon = VocabulariesContainer.options.inputIconSearch;
            console.log('empty input');
        } else {
            $scope.search.icon = VocabulariesContainer.options.inputIconClear;
        }

        // need to query vocab then update showed items

        

    });

    var callback = function(items){
        $scope.displayedItems = items;
    };

});