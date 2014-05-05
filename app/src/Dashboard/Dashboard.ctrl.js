angular.module('Pundit2.Dashboard')
.controller('DashboardCtrl', function($document, $window, $scope, Dashboard) {

    var jqElement = {

        // dashboard container
        container : angular.element('.pnd-dashboard-container'),

        // dashboard footer
        footer : angular.element('.pnd-dashboard-footer'),

        //dashboard separtors
        firstSeparator : angular.element('.pnd-dashboard-separator-1'),
        secondSeparator : angular.element('.pnd-dashboard-separator-2'),

        // panels
        panelLists : angular.element('.pnd-dashboard-panel-lists'),
        panelTools : angular.element('.pnd-dashboard-panel-tools'),
        panelDetails : angular.element('.pnd-dashboard-panel-details')

    };

    var separatorsWidth = Dashboard.options.separatorsWidth;
    // set separators width
    angular.element('.pnd-dashboard-separator').css({
        'width' : separatorsWidth,
        'bottom' : Dashboard.options.footerHeight
    });
    // set footer height
    jqElement.footer.css({
        'height' : Dashboard.options.footerHeight
    });
    // set panels bottom
    angular.element('.pnd-dashboard-panel').css({
        'bottom' : Dashboard.options.footerHeight
    });
    // set panel width when collapsed
    angular.element('.pnd-dashboard-panel-collapsed').css({
        'width' : Dashboard.options.panelCollapseWidth
    });

    $scope.isDashboardVisible = Dashboard.isDashboardVisible();
    // TODO read default from dashboard.options
    $scope.listsCollapsed = false;
    $scope.toolsCollapsed = false;
    $scope.detailsCollapsed = false;

    var windowLastWidth = 0, windowCurrentWidth;
    angular.element($window).resize(function(){
        windowCurrentWidth = angular.element($window).innerWidth();
        if ( windowCurrentWidth !== windowLastWidth ) {
            windowLastWidth = windowCurrentWidth;
            Dashboard.setContainerWidth(windowCurrentWidth);
        }
    });

    $scope.useFluid = true;
    $scope.$watch('useFluid', function(value) {
        Dashboard.options.fluidResize = value;
    });

    /**** CONTAINER WATCHER ****/

    $scope.$watch(function() {
        return Dashboard.getContainerHeight();
    }, function(newHeight, oldHeight) {
        jqElement.container.css({
            'height' : newHeight
        });
    });

    $scope.$watch(function() {
        return Dashboard.getContainerWidth();
    }, function(newWidth, oldWidth) {
        jqElement.container.css({
            'width' : newWidth
        });
    });

    /**** PANELS WIDTH WATCHER 

    $scope.$watch(function() {
        return Dashboard.getListsPanelWidth();
    }, function(newWidth, oldWidth) {
        jqElement.panelLists.css({
            'width' : newWidth
        });
        jqElement.firstSeparator.css({
            'left' : newWidth
        });
    });

    $scope.$watch(function() {
        return Dashboard.getToolsPanelWidth();
    }, function(newWidth, oldWidth) {
        jqElement.panelTools.css({
            'width' : newWidth
        });
    });

    $scope.$watch(function() {
        return Dashboard.getDetailsPanelWidth();
    }, function(newWidth, oldWidth) {
        var left = Dashboard.getDetailsPanelLeft();
        jqElement.panelDetails.css({
            'width' : newWidth
        });
        jqElement.secondSeparator.css({
            'left' : left - separatorsWidth
        });
    }); ****/

    /**** TOGGLE WATCHER ****/

    $scope.$watch(function() {
        return Dashboard.isDashboardVisible();
    }, function(newVis, oldVis) {
        $scope.isDashboardVisible = newVis;
    });

    /**** PANEL LEFT WATCHER 

    $scope.$watch(function() {
        return Dashboard.getToolsPanelLeft();
    }, function(newLeft, oldLeft) {
        jqElement.panelTools.css({
            'left' : newLeft
        });
    });
 
    $scope.$watch(function() {
        return Dashboard.getDetailsPanelLeft();
    }, function(newLeft, oldLeft) {
        jqElement.panelDetails.css({
            'left' : newLeft
        });
    });****/

    /**** FOOTER ****/

    var footerMouseUpHandler = function() {
        // remove handlers
        $document.off('mousemove', footerMouseMoveHandler);
        $document.off('mouseup', footerMouseUpHandler);

        Dashboard.log('Footer mouseup: removing handlers');
    }

    var lastPageY;
    var footerMouseMoveHandler = function(event) {
        var dy = event.pageY - lastPageY;
        if ( Dashboard.tryToSetContainerHeight(dy) ) {
            lastPageY = event.pageY;
        }
    }

    $scope.footerMouseDownHandler = function(event) {
        if ( event.which === 1 ) {
            event.preventDefault();        
            $document.on('mouseup', footerMouseUpHandler);
            $document.on('mousemove', footerMouseMoveHandler);

            lastPageY = event.pageY;
        }
    };

    Dashboard.log('Controller Run');

});