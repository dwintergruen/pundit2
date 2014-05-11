/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, AnnotationSidebar) {
    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');

    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(currentState) {
        $scope.isAnnotationSidebarExpanded = currentState;

        // TODO: Qui o nel service?  --- Qui IMHO e' ok
        if (currentState) {

            // TODO: perche' 2 classi?
            // TODO: toggleClass() ?
            body.addClass( 'pnd-body-with-sidebar-expanded' );
            container.removeClass( 'pnd-annotation-sidebar-collapsed' );
            container.addClass( 'pnd-annotation-sidebar-expanded' );
        } else {
            body.removeClass( 'pnd-body-with-sidebar-expanded' );
            container.removeClass( 'pnd-annotation-sidebar-expanded' );
            container.addClass( 'pnd-annotation-sidebar-collapsed' ); 
        }
    });

    AnnotationSidebar.log('Controller Run');
});