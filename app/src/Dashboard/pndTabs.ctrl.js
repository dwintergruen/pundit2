angular.module('Pundit2.Dashboard')
.controller('pndTabsCtrl', function($document, $window, $scope, Dashboard, $element) {

    var options = {
        animation: 'am-fade',
        offsetButton: 20
    };

    // Support animations
    if(options.animation) {
        $element.addClass(options.animation);
    }

    // contains tabs content and tabs title
    // passed in directive
    $scope.panes = null;

    // contain tabs that don't fill in width panel
    $scope.hiddenTabs = [];


    $scope.$watch('tabs', function(newValue) {
        // If $scope.panes has already been set to tabs value, skip this watch
        if (angular.equals(newValue, $scope.panes)) {
            return;
        }

        $scope.panes = angular.copy(newValue);

        // for each tabs set visibility to true as default
        for (var p in $scope.panes) {
            $scope.panes[p].isVisible = true;
        }

    }, true);

    var panesLen = 0,
        panesJustChanged = false;

        $scope.$watch(
        function() {
            //return angular.element($element).find('ul.pnd-tab-header>li').length;
            return angular.element($element).children('ul.pnd-tab-header').children('li').length;
        },
        function(liLength) {
            if (liLength > 0) {
                panesLen = liLength;
                panesJustChanged = true;
                check();
            }
        });

    var panesWidth = 0;

    // when <ul> is ready, check is executed
    $scope.$watch(
        function() {
            //return angular.element($element).find('ul.pnd-tab-header').css('width');
            return angular.element($element).children('ul.pnd-tab-header').css('width');
        },
        function(newWidth) {
            panesWidth = parseInt(newWidth, 10);
            check();
    });

    // check if panels are renderer.
    // Init() is executed only when <li> tabs are changed in DOM
    var check = function() {
        $scope.hiddenTabs = [];
        if (panesLen > 0 && panesWidth > 0) {
            if (panesJustChanged) {
                panesJustChanged = false;
                init();
            }
            setVisibility(panesWidth);
        }
    };

    // <li> tabs initialization
    // for each <li> tab get his width and store it
    var init = function() {
        //var tabsElement = angular.element($element).find('ul.pnd-tab-header>li');
        var tabsElement = angular.element($element).children('ul.pnd-tab-header').children('li');
        for (var i = 0; i < tabsElement.length; i++){
            var w = parseInt(angular.element(tabsElement[i]).css('width'), 10);
            $scope.panes[i].width = w;
            //$scope.panes[i].isVisible = true;
        }
    };

    // for each tabs, check if it fit in the <ul> width
    // if fit, set its visibility to true and show in DOM
    // otherwise set its visibility to false
    // and add the tab in an array containing all tabs thad don't fit
    var setVisibility = function(ulWidth) {
        
        var widthToFit = ulWidth - options.offsetButton;
        var tmpWidth = 0;

        // for each tabs, check if his width, added to the total current width
        // fit to the container width
        for (var i = 0; i < $scope.panes.length; i++){
            // total width of current visible tabs
            var w = tmpWidth + $scope.panes[i].width;
            // if width tab fit, set its visibility to true and update the total width of current visible tabs
            if (w < widthToFit){
                $scope.panes[i].isVisible = true;
                tmpWidth = w;
            } else {
                // it width tab doesn't fit, set its visibility to false and add tabs in hiddenTabs array
                $scope.panes[i].isVisible = false;
                var t = {
                    text: $scope.panes[i].title,
                    click: "setActive("+i+", $event)"
                };
                $scope.hiddenTabs.push(t);
            }
        }
    };

    // Add base class
    $element.addClass('tabs');

    $scope.active = $scope.activePane = 0;

    // set a tab as active
    $scope.setActive = function(index) {
        $scope.active = index;

        // Setting activeTab back into the original tabs array, so the provider of the tabs
        // can be notified when a tab is selected (eg: PageItemsContainer!)
        $scope.tabs.activeTab = index;
        // set to true if an hidden tab is selected and is active
        $scope.hiddenTabIsActive = !$scope.panes[index].isVisible;
    };

    var hiddenTabsArePresent = false;


    // check when array containing tabs don't fit in the panel,
    // and set true if array contain is not empty, false otherwise
    $scope.$watch(
        function() {
            return $scope.hiddenTabs;
        },
        function() {
            hiddenTabsArePresent = $scope.hiddenTabs.length > 0;
    });

    // return true if there are some hidden tabs to show
    $scope.hiddenTabsToShow = function() {
        return hiddenTabsArePresent;
    };

});