
angular.module('KorboEE')
    .controller('keeLanguagesCtrl', function($document, $window, $rootScope, $scope, Dashboard, $element) {

        var options = {
            animation: 'am-fade',
            offsetButton: 40
        };

        $scope.tabs.activeTab = 0;

        $scope.hiddenTabsDropdownTemplate = 'src/ContextualMenu/dropdown.tmpl.html';

        // Support animations
        if(options.animation) {
            $element.addClass(options.animation);
        }

        // contains tabs content and tabs title
        // passed in directive
        $scope.panes = null;

        // contain tabs that don't fill in width panel
        $scope.hiddenTabs = [];


        $scope.$watch('tabs', function(newValue, oldValue) {

            // Change active tabs if current language was removed
            if(newValue.length < oldValue.length){
                var removedLanguage = oldValue.filter(function(obj) {
                    return !newValue.some(function(obj2) {
                        return obj.title == obj2.title;
                    });
                });
                if(oldValue[$scope.tabs.activeTab].title === removedLanguage[0].title){
                    $scope.setActive(0);
                }
            }

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
                // TODO not watch DOM element, other solution is possible ?
                return angular.element($element).children('ul.pnd-tab-header').children('li:not(.pull-right)').length;
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
        var el = angular.element($element).children('ul.pnd-tab-header')
        $scope.$watch(
            function() {
                //return angular.element($element).find('ul.pnd-tab-header').css('width');
                return el.width();
            },
            function(newWidth) {
                panesWidth = parseInt(newWidth, 10);
                check();

                // update show-tabs button state
                if(isTabHidden() === -1) {
                    $scope.hiddenTabIsActive = false;
                } else {
                    $scope.hiddenTabIsActive = true;
                }
            });

        // check if panels are renderer.
        // Init() is executed only when <li> tabs are changed in DOM
        var check = function() {
            //$scope.hiddenTabs = [];
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
            var tabsElement = angular.element($element).children('ul.pnd-tab-header').children('li:not(.pull-right)');
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
            $scope.hiddenTabs = [];
            var widthToFit = ulWidth - options.offsetButton;
            var tmpWidth = 0;
            var currentTab;
            var firstHiddenTab;
            var w;
            // for each tabs, check if his width, added to the total current width
            // fit to the container width
            for (var i = 0; i < $scope.panes.length; i++){
                currentTab = $scope.panes[i];
                w = tmpWidth + currentTab.width;
                // if tab doesn't fit, get index of first hidden tabs
                if (w > widthToFit){
                    firstHiddenTab = i;
                    break;
                } else {
                    // if width tab fit, set its visibility to true and update the total width of current visible tabs
                    tmpWidth = w;
                }
            }

            for (i = 0; i < $scope.panes.length; i++){
                currentTab = $scope.panes[i];
                // for each tab, if his index is less than firstHiddenTab, show it
                if(i < firstHiddenTab || typeof(firstHiddenTab) === 'undefined'){
                    currentTab.isVisible = true;
                } else {
                    // otherwise hide it
                    currentTab.isVisible = false;
                    var t = {
                        text: currentTab.title,
                        click: "setActive("+i+", $event)"
                        //isActive: false
                    };

                    // set hidden tabs active state
                    if(i === $scope.tabs.activeTab){
                        t.isActive = true;
                    } else {
                        t.isActive = false;
                    }
                    // set all hidden tabs in the array
                    $scope.hiddenTabs.push(t);
                }
            }

        };

        // check it a tab is hidden or not
        // if called without parameter, check if selected tab is hidden or not
        // return -1 if tab is not hidden
        // otherwise return index of hidden tab
        var isTabHidden = function(tab) {
            var tabToFind;
            // if there aren't hidden tabs return -1
            if(typeof($scope.hiddenTabs) === 'undefined') {
                return -1;
            }

            if($scope.hiddenTabs.length === 0) {
                return -1;
            }

            // if there aren't active tabs return -1
            if(typeof($scope.tabs.activeTab) === 'undefined') {
                return -1;
            }

            // if tab is undefined, check the active tab, otherwise check tab given as parameter
            if(tab === '' || typeof(tab) === 'undefined') {
                var index = $scope.tabs.activeTab;
                tabToFind = $scope.panes[index];
            } else {
                tabToFind = tab;
            }

            // if tab is found in hiddenTabs array, return index of its position in the array
            for(var j=0; j<$scope.hiddenTabs.length; j++){
                if($scope.hiddenTabs[j].text === tabToFind.title){
                    return j;
                }
            }
            return -1;
        };

        // Add base class
        $element.addClass('tabs');

        $scope.active = $scope.activePane = 0;

        $rootScope.$on('pnd-dashboard-show-tab', function(evt, title){

            for (var i=0; i<$scope.panes.length; i++) {
                if ($scope.panes[i].title === title) {
                    if ($scope.active !== i) {
                        $scope.setActive(i);
                    }
                    // parent scope must to be the scope of the
                    // dashboardPanel controller
                    if ($scope.$parent.isCollapsed) {
                        $scope.$parent.toggleCollapse();
                    }
                    return;
                }
            }
        });

        // set a tab as active
        $scope.setActive = function(index) {

            // reset state for hidden tabs if present
            if($scope.hiddenTabs.length !== 0){
                for(var i=0; i<$scope.hiddenTabs.length; i++){
                    $scope.hiddenTabs[i].isActive = false;
                }

            }

            $scope.active = index;

            // Setting activeTab back into the original tabs array, so the provider of the tabs
            // can be notified when a tab is selected (eg: PageItemsContainer!)
            $scope.tabs.activeTab = index;

            // set to true if an hidden tab is selected and is active
            //$scope.hiddenTabIsActive = !$scope.panes[index].isVisible;
            if(!$scope.panes[index].isVisible) {
                $scope.hiddenTabIsActive = true;
                var k = isTabHidden($scope.panes[index]);
                $scope.hiddenTabs[k].isActive = true;
            } else {
                $scope.hiddenTabIsActive = false;
            }

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