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

});