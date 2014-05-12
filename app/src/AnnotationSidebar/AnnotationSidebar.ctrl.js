/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, $rootScope, $window, AnnotationSidebar) {
    var bodyClasses = AnnotationSidebar.options.bodyExpandedClass + ' ' + AnnotationSidebar.options.bodyCollapsedClass;
    var sidebarClasses = AnnotationSidebar.options.sidebarExpandedClass + ' ' + AnnotationSidebar.options.sidebarCollapsedClass;

    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');

    container.css('height', body.innerHeight() + 'px');

    // Start reading the default
    if (AnnotationSidebar.options.isAnnotationSidebarExpanded) {
        body.addClass(AnnotationSidebar.options.bodyExpandedClass);
        container.addClass(AnnotationSidebar.options.sidebarExpandedClass);
    } else {
        body.addClass(AnnotationSidebar.options.bodyCollapsedClass);
        container.addClass(AnnotationSidebar.options.sidebarCollapsedClass);
    }

    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(currentState, oldState) {
        $scope.isAnnotationSidebarExpanded = currentState;

        if (currentState !== oldState) {
            body.toggleClass(bodyClasses);
            container.toggleClass(sidebarClasses);
        }
    });

    var bodyCurrentHeight;
    var sidebarCurrentHeight;
    angular.element($window).bind('resize', function() {
        bodyCurrentHeight = body.innerHeight();
        sidebarCurrentHeight = container.innerHeight();
        if ( bodyCurrentHeight !== sidebarCurrentHeight ) {
            container.css('height', bodyCurrentHeight + 'px');
        }
    });
    // TODO: deprecato? valutare alternative
    body.bind('DOMSubtreeModified', function() {
        bodyCurrentHeight = body.innerHeight();
        sidebarCurrentHeight = container.innerHeight();
        if ( bodyCurrentHeight !== sidebarCurrentHeight ) {
            container.css('height', bodyCurrentHeight + 'px');
        }
    });

    AnnotationSidebar.log('Controller Run');
});