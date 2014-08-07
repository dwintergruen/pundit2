angular.module('Pundit2.MyNotebooksContainer')
.controller('MyNotebooksContainerCtrl', function($scope, $rootScope, $element, MyNotebooksContainer, NotebookExchange, NotebookComposer) {

    var inputIconSearch = 'pnd-icon-search',
        inputIconClear = 'pnd-icon-times';

    var allNotebook = [];
    $scope.displayedNotebook = allNotebook;

    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";

    var orderBtn = angular.element($element).find('.my-notebooks-btn-order');

    // read by <notebook> directive
    // will trigger this contextual menu type clicking on the contextual notebook icon
    $scope.notebookMenuType = MyNotebooksContainer.options.cMenuType;

    $scope.message = {
        flag: true,
        text: "No notebooks found."
    };

    // notebook property used to compare
    // legal value are: 'type' and 'label'
    var order = 'label';

    // how order notebooks, true is ascending, false is descending
    $scope.reverse = false;

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
        }
    ];

    var removeSpace = function(str){
        return str.replace(/ /g,'');
    };

    // getter function used inside template to order notebooks 
    // return the notebooks property value used to order
    $scope.getOrderProperty = function(ns){
        return removeSpace(ns.label);
    };

    $scope.createNewNotebook = function(){
        $rootScope.$emit('pnd-dashboard-show-tab', NotebookComposer.options.clientDashboardTabTitle);
        NotebookComposer.setNotebookToEdit(null);
    };

    // Filter notebooks which are shown
    // go to lowerCase and replace multiple space with single space, 
    // to make the regexp work properly
    var filterItems = function(str){

        str = str.toLowerCase().replace(/\s+/g, ' ');
        var strParts = str.split(' '),
            reg = new RegExp(strParts.join('.*'));

        $scope.displayedNotebook = allNotebook.filter(function(ns){
            return ns.label.toLowerCase().match(reg) !== null;
        });

        // update text messagge
        if(str === ''){
            $scope.message.text = "No notebook found.";
        } else {
            $scope.message.text = "No notebook found to: "+str;
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
        if (typeof($scope.displayedNotebook) === 'undefined') {
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
        return NotebookExchange.getMyNotebooks();
    }, function(ns) {
        // update all notebooks array and display new notebook
        allNotebook = ns;
        filterItems($scope.search.term);
    }, true);

    $scope.$watch(function() {
        return $scope.displayedNotebook.length;
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

});