angular.module('Pundit2.PredicatesContainer')

.controller('PredicatesContainerCtrl', function($scope, $rootScope, $element,
    Config, ItemsExchange, PredicatesContainer, TripleComposer, Preview,
    EventDispatcher, Analytics) {

    var inputIconSearch = 'pnd-icon-search',
        inputIconClear = 'pnd-icon-times';

    var allPredicates = [];
    $scope.displayedItems = allPredicates;

    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";

    $scope.itemSelected = null;
    $scope.isUseActive = false;

    $scope.canBeUseAsPredicate = false;

    var orderBtn = angular.element($element).find('.predicates-items-btn-order');

    // read by <item-notebook> directive
    // will trigger this contextual menu type clicking on the contextual notebook icon
    $scope.itemMenuType = PredicatesContainer.options.cMenuType;

    $scope.message = {
        flag: true,
        text: "No predicates found."
    };

    // notebook property used to compare
    // legal value are: 'type' and 'label'
    var order = 'label';

    // how order notebooks, true is ascending, false is descending
    $scope.reverse = false;

    // set as active a label in contextual menu
    var setLabelActive = function(index) {
        for (var i in $scope.dropdownOrdering) {
            $scope.dropdownOrdering[i].isActive = false;
        }
        $scope.dropdownOrdering[index].isActive = true;
    };

    var resetContainer = function() {
        $scope.itemSelected = null;
        $scope.isUseActive = false;
        $scope.canBeUseAsPredicate = false;
    };

    // sort button dropdown content
    $scope.dropdownOrdering = [{
        text: 'Label Asc',
        click: function() {
            order = 'label';
            $scope.reverse = false;
            setLabelActive(0);

            var eventLabel = getHierarchyString();
            eventLabel += "--sort--labelAsc";
            Analytics.track('buttons', 'click', eventLabel);
        },
        isActive: order === 'label' && $scope.reverse === false
    }, {
        text: 'Label Desc',
        click: function() {
            order = 'label';
            $scope.reverse = true;
            setLabelActive(1);

            var eventLabel = getHierarchyString();
            eventLabel += "--sort--labelDesc";
            Analytics.track('buttons', 'click', eventLabel);
        },
        isActive: order === 'label' && $scope.reverse === true
    }];

    var removeSpace = function(str) {
        return str.replace(/ /g, '');
    };

    // getter function used inside template to order notebooks 
    // return the notebooks property value used to order
    $scope.getOrderProperty = function(ns) {
        return removeSpace(ns.label);
    };

    // Filter notebooks which are shown
    // go to lowerCase and replace multiple space with single space, 
    // to make the regexp work properly
    var filterItems = function(str) {

        str = str.toLowerCase().replace(/\s+/g, ' ');
        var strParts = str.split(' '),
            reg = new RegExp(strParts.join('.*'));

        $scope.displayedItems = allPredicates.filter(function(ns) {
            if (typeof(ns.mergedLabel) === 'undefined') {
                return ns.label.toLowerCase().match(reg) !== null;
            } else {
                return ns.mergedLabel.toLowerCase().match(reg) !== null;
            }
        });

        // update text messagge
        if (str === '') {
            $scope.message.text = "No predicates found.";
        } else {
            $scope.message.text = "No predicates found to: " + str;
        }
    };

    // getter function used to build hierarchystring.
    // hierarchystring is used for tracking events with analytics.
    var getHierarchyString = function() {
        // Temporary solution to find hierarchystring.
        var eventLabel = "";
        var myScope = $scope;
        do {
            if (typeof(myScope) === 'undefined' || myScope === null) {
                break;
            }
            if (myScope.hasOwnProperty('pane')) {
                if (myScope.pane.hasOwnProperty('hierarchystring')) {
                    eventLabel = myScope.pane.hierarchystring;
                }
                break;
            }
            myScope = myScope.$parent;
        }
        while (typeof(myScope) !== 'undefined' && myScope !== null);

        if ($scope.hasOwnProperty('tabs')) {
            eventLabel += "--" + $scope.tabs[$scope.tabs.activeTab].title;
        }

        return eventLabel;
    }

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
        return ItemsExchange.getItemsByContainer(Config.modules.Client.relationsContainer);
    }, function(pred) {
        // update predicates
        allPredicates = pred;
        filterItems($scope.search.term);
    }, true);

    $scope.$watch(function() {
        return $scope.displayedItems.length;
    }, function(len) {
        // show empty lists messagge
        if (len === 0) {
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

        $scope.canBeUseAsPredicate = TripleComposer.canBeUseAsPredicate(item);
    };

    $scope.onClickUsePredicate = function() {
        if ($scope.itemSelected === null) {
            return;
        }

        TripleComposer.addToPredicate($scope.itemSelected);

        var eventLabel = getHierarchyString();
        eventLabel += "--setPredicate";
        Analytics.track('buttons', 'click', eventLabel);

        resetContainer();
    }

    EventDispatcher.addListener('Pundit.changeSelection', function() {
        resetContainer();
    });

});