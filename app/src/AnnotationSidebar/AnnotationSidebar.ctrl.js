/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, AnnotationSidebar) {
    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');

    body.addClass( 'pnd-as-transition' );
    body.addClass( 'pnd-body-with-sidebar-collapsed' );


    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(currentState) {
        $scope.isAnnotationSidebarExpanded = currentState;

        // TODO: Qui o nel service? 
        if (currentState) {
            body.removeClass( 'pnd-body-with-sidebar-collapsed' );
            body.addClass( 'pnd-body-with-sidebar-expanded' );
            container.removeClass( 'pnd-annotation-sidebar-collapsed' );
            container.addClass( 'pnd-annotation-sidebar-expanded' );
        } else {
            body.removeClass( 'pnd-body-with-sidebar-expanded' );
            body.addClass( 'pnd-body-with-sidebar-collapsed' );
            container.removeClass( 'pnd-annotation-sidebar-expanded' );
            container.addClass( 'pnd-annotation-sidebar-collapsed' ); 
        }
    });

    AnnotationSidebar.log('Controller Run');
});