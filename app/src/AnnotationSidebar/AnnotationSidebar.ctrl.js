/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, $filter, $window, AnnotationSidebar, Dashboard) {
    var bodyClasses = AnnotationSidebar.options.bodyExpandedClass + ' ' + AnnotationSidebar.options.bodyCollapsedClass;
    var sidebarClasses = AnnotationSidebar.options.sidebarExpandedClass + ' ' + AnnotationSidebar.options.sidebarCollapsedClass;

    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');

    // TODO: prelevare la dimensione reale
    // TODO: sarebbe meglio avere un metodo direttamente di toolbar?
    // var toolbarHeight = angular.element('toolbar nav').css('height');

    var state = {
        toolbarHeight: 30,
        newMarginTopSidebar: 0,
        sidebarCurrentHeight: 0,
        sidebarNewHeight: 0
    };

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

    $scope.$watch(function() {
        return $scope.filters;
    }, function(currentFilters) {
        // TODO: individuare un modo migliore per rilevare i singoli filtri attivi
        $scope.annotations = AnnotationSidebar.getAllAnnotationsFiltered(currentFilters);
    }, true);

    // Watch annotations
    $scope.$watch(function() {
        return AnnotationSidebar.getAllAnnotations();
    }, function(currentAnnotations) {
        $scope.annotations = currentAnnotations;
        // TODO: se ci sono filtri attivi, bisogna richiamare i filtri
    });

    // Wacth dashobard height for top of sidebar
    $scope.$watch(function() {
        return {
            dashboardHeight: Dashboard.getContainerHeight(),
            dashboardVisibility: Dashboard.isDashboardVisible()   
        };
    }, function(dashboardValue) {
        if (dashboardValue.dashboardVisibility){
            state.newMarginTopSidebar = state.toolbarHeight + dashboardValue.dashboardHeight;
            container.css('top', state.newMarginTopSidebar + 'px');
        } else {
            container.css('top', state.toolbarHeight + 'px');
        }
    }, true);

    // Annotation sidebar height
    var resizeSidebarHeight = function(bodyHeight, windowHeight) {
        state.sidebarNewHeight = Math.max(bodyHeight, windowHeight - state.toolbarHeight);
        state.sidebarCurrentHeight = container.innerHeight();
        if (state.sidebarNewHeight !== state.sidebarCurrentHeight) {
            container.css('height', state.sidebarNewHeight + 'px');
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