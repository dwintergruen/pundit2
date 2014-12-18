angular.module('Pundit2.Dashboard')

.controller('DashboardCtrl', function($document, $window, $rootScope, $scope, $compile, Dashboard) {

    var jqElement = {
        container: angular.element('.pnd-dashboard-container'),
        footer: angular.element('.pnd-dashboard-footer'),
        body: angular.element('body')
    };

    // set footer height
    jqElement.footer.css({
        'height': Dashboard.options.footerHeight
    });

    $scope.isDashboardVisible = Dashboard.isDashboardVisible();

    // Will check body innerWidth and its margins and set Dashboard width
    // if needed
    var resizeContainer = function() {
        var body = angular.element('body'),
            innerWidth = parseInt(body.innerWidth(), 10),
            marginLeft = parseInt(body.css('margin-left'), 10),
            marginRight = parseInt(body.css('margin-right'), 10),
            width = innerWidth + marginRight + marginLeft;

        if (width !== Dashboard.getContainerWidth()) {
            Dashboard.setContainerWidth(width);
            $rootScope.$$phase || $scope.$digest();
        }
    };

    // We want to watch body innerWidth and bind a listener to the resize
    // event on window, to be sure to intercept both window resize and scrollbars
    // show and hide events
    $scope.$watch(function() {
        return jqElement.body.innerWidth();
    }, resizeContainer);

    angular.element($window).resize(resizeContainer);


    // Add configured panels markup to the Dashboard
    $scope.$watch(function() {
        return Dashboard.getConfiguredPanels();
    }, function(panels) {
        for (var p in panels) {
            Dashboard.log('Adding configured panel to Dashboard: ' + p);
            jqElement.container.append('<dashboard-panel paneltitle="' + p + '" hierarchystring="dashboard--panel-' + p + '"></dashboard-panel>');
        }
        var added = angular.element("dashboard-panel");
        $compile(added)($scope);
    });


    /**** CONTAINER WATCHER ****/

    $scope.$watch(function() {
        return Dashboard.getContainerHeight();
    }, function(newHeight) {
        jqElement.container.css({
            'height': newHeight
        });

        // Push the body element down too
        var top = parseInt(jqElement.container.css('top'), 10);
        jqElement.body.css({
            'marginTop': top + newHeight
        });
    });

    $scope.$watch(function() {
        return Dashboard.getContainerWidth();
    }, function(newWidth) {
        jqElement.container.css({
            'width': newWidth
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
            var currentTop = parseInt(jqElement.container.css('top'), 10),
                newTop = newVis ? currentTop + Dashboard.getContainerHeight() : currentTop;
            jqElement.body.css({
                'marginTop': newTop
            });
        }
    });

    Dashboard.log('Controller Run');

});