angular.module('Pundit2.Dashboard')
.controller('DashboardPanelCtrl', function($document, $window, $scope, $element, Dashboard) {

    // readed from default (not change)
    $scope.collapsedWidth = Dashboard.options.panelCollapseWidth;
    $scope.bottom = Dashboard.options.footerHeight;

    // overrided in Dashbpoard.addPanel()
    $scope.minWidth = 100;
    $scope.ratio = 1;
    
    $scope.isCollapsed = false;

    // set by Dashboard.resizeAll()
    $scope.left = 0;
    $scope.width = 200;

    // tabs
    $scope.tabs = [];

    $scope.toggleCollapse = function() {

        if( $scope.isCollapsed ) {
            $scope.isCollapsed = !$scope.isCollapsed;
            var foo = {};
            foo[$scope.index] = $scope.minWidth;
            Dashboard.resizeAll(foo);
            
        } else if ( Dashboard.canCollapsePanel() ) {
            $scope.isCollapsed = !$scope.isCollapsed;
            Dashboard.resizeAll();
        }
    };

    $scope.addContent = function(tabName, tabContent){
        $scope.tabs.push({
            title: tabName,
            template: tabContent
        });
        Dashboard.log('Added content '+tabName+' to panel '+$scope.title);
    };

    var lastPageX;
    var moveHandler = function(evt) {
        var resized,
            deltaX = evt.pageX - lastPageX;
        if (deltaX === 0) { return; }
        resized = Dashboard.tryToResizeCouples($scope.index, deltaX);        
        if (resized) {
            lastPageX = evt.pageX;
        }
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
    }, function(newValue, oldValue) {
        $scope.setTabContentHeight();
    });

    $scope.setTabContentHeight = function() {

        var el = angular.element($element).find('.pnd-inner .pnd-tab-content');
        if (el.length === 0) {
            return;
        }

        var h = Dashboard.getContainerHeight();

        // .pnd-tab-header height
        h -= Dashboard.options.panelTabsHeight;

        // .pnd-panel-tab-content-header height
        h -= Dashboard.options.panelContentHeaderHeight;

        // .pnd-inner .pnd-panel-tab-header height
        h -= Dashboard.options.panelInnerTabsHeight;

        // .panel-tab-content-footer height
        h -= Dashboard.options.panelFooterHeight;

        // Dashboard footer height
        h -= Dashboard.options.footerHeight;

        el.height(h);
    };

    Dashboard.addPanel($scope);
    Dashboard.log('Panel '+$scope.title+' Controller Run');
});