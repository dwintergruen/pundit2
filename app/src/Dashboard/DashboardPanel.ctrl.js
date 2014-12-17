// TODO: optimize panel resize

angular.module('Pundit2.Dashboard')

.controller('DashboardPanelCtrl', function($document, $window, $scope, $rootScope, $element, $timeout, Dashboard, ResourcePanel, Annomatic) {

    // readed from default (not change)
    $scope.collapsedWidth = Dashboard.options.panelCollapseWidth;
    $scope.bottom = Dashboard.options.footerHeight;

    // overrided in Dashbpoard.addPanel()
    $scope.minWidth = 100;
    $scope.ratio = 1;

    $scope.isCollapsed = false;
    $scope.canCollapsePanel = true;

    // set by Dashboard.resizeAll()
    $scope.left = 0;
    $scope.width = 200;

    // tabs
    $scope.tabs = [];

    $scope.isAnnomaticRunning = false;

    // Watch Annomatic status
    $scope.$watch(function() {
        return Annomatic.isRunning();
    }, function(currentState) {
        if (currentState && Dashboard.isDashboardVisible()) {
            Dashboard.toggle();
        }
        $scope.isAnnomaticRunning = currentState;
    });

    // TODO fix flickering and use better implementation
    $scope.$watch(function() {
        return $scope.tabs.activeTab;
    }, function() {
        $timeout(function() {
            $scope.setTabContentHeight();
        }, 30);
    });

    $scope.toggleCollapse = function() {
        ResourcePanel.hide();
        
        if ($scope.isCollapsed) {
            $scope.isCollapsed = !$scope.isCollapsed;
            var foo = {};
            foo[$scope.index] = $scope.minWidth;
            Dashboard.resizeAll(foo);

        } else if (Dashboard.canCollapsePanel()) {
            $scope.isCollapsed = !$scope.isCollapsed;
            Dashboard.resizeAll();
        }
    };

    $scope.addContent = function(tabName, tabContent) {
        $scope.tabs.push({
            title: tabName,
            template: tabContent
        });
        Dashboard.log('Added content ' + tabName + ' to panel ' + $scope.title);
    };

    var lastPageX;
    var moveHandler = function(evt) {
        var resized,
            deltaX = evt.pageX - lastPageX;
        if (deltaX === 0) {
            return;
        }
        resized = Dashboard.tryToResizeCouples($scope.index, deltaX);
        if (resized) {
            lastPageX = evt.pageX;
        }

        ResourcePanel.updatePosition();
    };
    var upHandler = function() {
        $document.off('mousemove', moveHandler);
        $document.off('mouseup', upHandler);
    };

    $scope.mouseDownHandler = function(evt) {
        evt.preventDefault();
        lastPageX = evt.pageX;
        $document.on('mousemove', moveHandler);
        $document.on('mouseup', upHandler);
    };

    // When the panel height gets resized, we must set some tab-content height to make it
    // scrollable properly
    $scope.$watch(function() {
        return Dashboard.getContainerHeight();
    }, function() {
        $scope.setTabContentHeight();
    });

    $scope.$watch(function() {
        return Dashboard.canCollapsePanel();
    }, function(newValue) {
        $scope.canCollapsePanel = newValue;
    });

    // Sets the scrollable height to the right values, depending on Dashboard's height.
    // Multiple cases:
    // .pnd-inner-scrollable (eg: Preview): larger scrollable area
    // .pnd-inner .pnd-tab-content (eg: Items containers): tinier scrollable area
    // TODO: optimize, resize only showed content not all panel content
    // and not use angular.element inside watcher, store a element reference and update it
    $scope.setTabContentHeight = function() {

        var h = Dashboard.getContainerHeight(),
            elInner = angular.element($element).find('.pnd-inner .pnd-tab-content'),
            elInnerScrollable = angular.element($element).find('.pnd-inner-scrollable'),
            elInnerScrollableNoHeader = angular.element($element).find('.pnd-inner-scrollable.pnd-inner-no-tabs');

        // .pnd-tab-header height
        h -= Dashboard.options.panelTabsHeight;

        // .pnd-panel-tab-content-header height
        h -= Dashboard.options.panelContentHeaderHeight;

        // .panel-tab-content-footer height
        h -= Dashboard.options.panelFooterHeight;

        // Dashboard footer height
        h -= Dashboard.options.footerHeight;

        if (elInner.length > 0) {
            // .pnd-inner .pnd-panel-tab-header height
            h -= Dashboard.options.panelInnerTabsHeight;

            elInner.height(h + 3);
        }
        if (elInnerScrollable.length > 0) {
            // TODO why +2 ???
            elInnerScrollable.height(h + 2);
        }
        if (elInnerScrollableNoHeader.length > 0) {
            // TODO why -9 ???
            h += Dashboard.options.panelContentHeaderHeight;
            elInnerScrollableNoHeader.height(h - 9);
        }

    };

    /**** FOOTER ****/

    var footerMouseUpHandler = function() {
        // remove handlers
        $document.off('mousemove', footerMouseMoveHandler);
        $document.off('mouseup', footerMouseUpHandler);
    };

    var lastPageY;
    var footerMouseMoveHandler = function(event) {
        var dy = event.pageY - lastPageY;
        if (Dashboard.increaseContainerHeight(dy)) {
            lastPageY = event.pageY;
        }
    };

    $scope.footerMouseDownHandler = function(event) {
        if (event.which === 1) {
            event.preventDefault();
            $document.on('mouseup', footerMouseUpHandler);
            $document.on('mousemove', footerMouseMoveHandler);

            lastPageY = event.pageY;
        }
    };

    Dashboard.addPanel($scope);
    $rootScope.$$phase || $scope.$digest();
    Dashboard.log('Panel ' + $scope.title + ' Controller Run');
});