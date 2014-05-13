angular.module('Pundit2.Dashboard')
.controller('DashboardPanelCtrl', function($document, $window, $scope, Dashboard) {

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

    Dashboard.log('Panel Controller Run');

});