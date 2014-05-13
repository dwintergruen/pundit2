/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, $rootScope, $window, AnnotationSidebar, Dashboard) {
    var bodyClasses = AnnotationSidebar.options.bodyExpandedClass + ' ' + AnnotationSidebar.options.bodyCollapsedClass;
    var sidebarClasses = AnnotationSidebar.options.sidebarExpandedClass + ' ' + AnnotationSidebar.options.sidebarCollapsedClass;

    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');

    // TODO: prelevare la dimensione reale
    // TODO: sarebbe meglio avere un metodo direttamente di toolbar?

    // var toolbarHeight = angular.element('toolbar nav').css('height');
    var toolbarHeight = 30;
    var newMarginTopSidebar;

    var sidebarCurrentHeight;
    var sidebarNewHeight;

    container.css('height', body.innerHeight() + 'px');

    // Start reading the default
    if (AnnotationSidebar.options.isAnnotationSidebarExpanded) {
        body.addClass(AnnotationSidebar.options.bodyExpandedClass);
        container.addClass(AnnotationSidebar.options.sidebarExpandedClass);
    } else {
        body.addClass(AnnotationSidebar.options.bodyCollapsedClass);
        container.addClass(AnnotationSidebar.options.sidebarCollapsedClass);
    }

    // Watch annotation sidebar expanded or collapsed
    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(currentState, oldState) {
        $scope.isAnnotationSidebarExpanded = currentState;

        if (currentState !== oldState) {
            body.toggleClass(bodyClasses);
            container.toggleClass(sidebarClasses);
        }
    });

    // Watch annotations
    $scope.$watch(function() {
        return AnnotationSidebar.getAllAnnotations();
    }, function(currentAnnotations) {
        $scope.annotations = currentAnnotations;
    }, true);

    // Wacth dashobard height for top of sidebar
    $scope.$watch(function() {
        return {
            dashboardHeight: Dashboard.getContainerHeight(),
            dashboardVisibility: Dashboard.isDashboardVisible()   
        };
    }, function(dashboardValue) {
        if (dashboardValue.dashboardVisibility){
            newMarginTopSidebar = toolbarHeight + dashboardValue.dashboardHeight;
            container.css('top', newMarginTopSidebar + 'px');
        } else {
            container.css('top', toolbarHeight + 'px');
        }
    }, true);

    // Annotation sidebar height
    var resizeSidebarHeight = function(bodyHeight, windowHeight) {
        sidebarNewHeight = Math.max(bodyHeight, windowHeight);
        sidebarCurrentHeight = container.innerHeight();
        if (sidebarNewHeight !== sidebarCurrentHeight) {
            container.css('height', sidebarNewHeight + 'px');
        }
    };
    $scope.$watch(function() {
        return body.innerHeight();
    }, function(bodyHeight) {
        resizeSidebarHeight(bodyHeight, $window.innerHeight);
    });
    angular.element($window).bind('resize', function () {
        resizeSidebarHeight(body.innerHeight(), $window.innerHeight);
    });

  
    AnnotationSidebar.log('Controller Run');
});