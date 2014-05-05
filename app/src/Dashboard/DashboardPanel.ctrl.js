angular.module('Pundit2.Dashboard')
.controller('DashboardPanelCtrl', function($document, $window, $scope, Dashboard) {

    $scope.isCollapsed = false;
    $scope.collapsedWidth = Dashboard.options.panelCollapseWidth;
    $scope.minWidth = 100;
    $scope.left = 0;
    $scope.width = 200;
    $scope.ratio = 1;
    $scope.bottom = Dashboard.options.footerHeight;

    $scope.toggleCollapse = function() {

        if( $scope.isCollapsed ) {
            $scope.isCollapsed = !$scope.isCollapsed;
            Dashboard.panelToggleCollapse(false);
            var foo = {};
            foo[$scope.index] = $scope.minWidth;
            Dashboard.resizeAll(foo);
            
        } else if ( Dashboard.getCollapsedNumber() < 2 ) {
            $scope.isCollapsed = !$scope.isCollapsed;
            Dashboard.panelToggleCollapse(true);
            Dashboard.resizeAll();
        }   

        /*$scope.isCollapsed = !$scope.isCollapsed;
        if (!$scope.isCollapsed) {
            var foo = {};
            foo[$scope.index] = $scope.minWidth;
            Dashboard.resizeAll(foo);
        } else {
            Dashboard.resizeAll();
        }*/
    };

    var lastPageX;
    var moveHandler = function(evt) {
        var resized,
            deltaX = evt.pageX - lastPageX;
        if (deltaX === 0) { return; }
        
        if (Dashboard.options.fluidResize)
            resized = Dashboard.tryToResizeFluid($scope.index, deltaX);
        else
            resized = Dashboard.tryToResizeCouples($scope.index, deltaX);
        
        if (resized) {
            lastPageX = evt.pageX;
        }
    };
    var upHandler = function(evt) {
        $document.off('mousemove', moveHandler);
        $document.off('mouseup', upHandler);
    };

    $scope.mouseDownHandler = function(e) {
        e.preventDefault();
        lastPageX = e.pageX;
        $document.on('mousemove', moveHandler);
        $document.on('mouseup', upHandler);  
        
    };

    Dashboard.addPanel($scope);

    Dashboard.log('run panel ctrl');

});