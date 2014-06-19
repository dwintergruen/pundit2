angular.module('Pundit2.MyNotebooksContainer')
.controller('MyNotebooksContainerCtrl', function($scope, ItemsExchange) {

    var inputIconSearch = 'pnd-icon-search',
        inputIconClear = 'pnd-icon-times';

    var allItem = [];
    $scope.displayedItems = allItem;

    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";

    // read by <item> directive (in PageItemsContainer/items.tmpl.html)
    // will trigger this contextual menu type clicking on the contextual item icon
    $scope.itemMenuType = 'notebooks';

    $scope.message = {
        flag: true,
        text: "I'm a welcome message"
    };    

    // items property used to compare
    // legal value are: 'type' and 'label'
    var order = 'label';

    // how order items, true is ascending, false is descending
    $scope.reverse = false;

    // sort button dropdown content
    $scope.dropdownOrdering = [
        { text: 'Label Asc', click: function(){
            order = 'label';
            $scope.reverse = false;
        }},
        { text: 'Label Desc', click: function(){
            order = 'label';
            $scope.reverse = true;
        }}
    ];

    var removeSpace = function(str){
        return str.replace(/ /g,'');
    };

    // getter function used inside template to order items 
    // return the items property value used to order
    $scope.getOrderProperty = function(item){
        return removeSpace(item.label);
    };

    // Filter items which are shown
    // go to lowerCase and replace multiple space with single space, 
    // to make the regexp work properly
    var filterItems = function(str){

        str = str.toLowerCase().replace(/\s+/g, ' ');
        var strParts = str.split(' '),
            reg = new RegExp(strParts.join('.*'));

        $scope.displayedItems = allItem.filter(function(items){
            return items.label.toLowerCase().match(reg) !== null;
        });

        // update text messagge
        if(str === ''){
            $scope.message.text = "I'm a welcome message";
        } else {
            $scope.message.text = "No item found to: "+str;
        }
    };

    // every time that user digit text inside <input> filter the items showed
    // show only items that contain the $scope.search substring inside their label
    // the match function ignore multiple spaces
    $scope.search = {
        icon: inputIconSearch,
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
            $scope.search.icon = inputIconSearch;
        } else {
            $scope.search.icon = inputIconClear;
        }

        filterItems(str);        

    });

    $scope.$watch(function() {
        return ItemsExchange.getItemsByContainer('myNotebooks');
    }, function(newItems) {
        // update all items array and display new items
        console.log(newItems)
        allItem = newItems;
        filterItems($scope.search.term);
    }, true);

    $scope.$watch(function() {
        return $scope.displayedItems.length;
    }, function(len) {
        // show empty lists messagge
        if (len === 0){
            $scope.message.flag = true;
        } else {
            $scope.message.flag = false;
        }
    });

});