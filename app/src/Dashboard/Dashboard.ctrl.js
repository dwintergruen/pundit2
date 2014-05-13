angular.module('Pundit2.Dashboard')
.controller('DashboardCtrl', function($document, $window, $scope, $compile, Dashboard) {

    var jqElement = {
        container : angular.element('.pnd-dashboard-container'),
        footer : angular.element('.pnd-dashboard-footer'),
        body : angular.element('body')
    };

    // set footer height
    jqElement.footer.css({
        'height' : Dashboard.options.footerHeight
    });

    $scope.isDashboardVisible = Dashboard.isDashboardVisible();

    var windowLastWidth = 0, windowCurrentWidth;
    angular.element($window).resize(function(){
        windowCurrentWidth = angular.element($window).innerWidth();
        if ( windowCurrentWidth !== windowLastWidth ) {
            windowLastWidth = windowCurrentWidth;
            Dashboard.setContainerWidth(windowCurrentWidth);
        }
    });


    // Add configured panels markup to the Dashboard
    $scope.$watch(function() {
        return Dashboard.getConfiguredPanels();
    }, function(panels) {
        for (var p in panels) {
            Dashboard.log('Adding configured panel to Dashboard: '+ p);
            jqElement.container.append('<dashboard-panel title="'+ p +'"></dashboard-panel>');
        }
        var added = angular.element("dashboard-panel");
        $compile(added)($scope);
    });


    /**** CONTAINER WATCHER ****/

    $scope.$watch(function() {
        return Dashboard.getContainerHeight();
    }, function(newHeight, oldHeight) {
        jqElement.container.css({
            'height' : newHeight
        });

        // Push the body element down too
        var top = parseInt(jqElement.container.css('top'));
        jqElement.body.css({
            'marginTop': top + newHeight
        });
    });

    $scope.$watch(function() {
        return Dashboard.getContainerWidth();
    }, function(newWidth, oldWidth) {
        jqElement.container.css({
            'width' : newWidth
        });
    });

    /**** TOGGLE WATCHER ****/

    $scope.$watch(function() {
        return Dashboard.isDashboardVisible();
    }, function(newVis, oldVis) {
        $scope.isDashboardVisible = newVis;

        // If we are really toggling, set the new top: toolbar height if we
        // are collapsed, else add our height too
        if (typeof(newVis) !== "undefined" && typeof(oldVis) !== "undefined") {
            var currentTop = parseInt(jqElement.container.css('top')),
                newTop = newVis ? currentTop + Dashboard.getContainerHeight() : currentTop;
            jqElement.body.css({
                'marginTop': newTop
            });
        }
    });

    /**** FOOTER ****/

    var footerMouseUpHandler = function() {
        // remove handlers
        $document.off('mousemove', footerMouseMoveHandler);
        $document.off('mouseup', footerMouseUpHandler);
    };

    var lastPageY;
    var footerMouseMoveHandler = function(event) {
        var dy = event.pageY - lastPageY;
        if ( Dashboard.increaseContainerHeight(dy) ) {
            lastPageY = event.pageY;
        }
    };

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