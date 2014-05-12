/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, AnnotationSidebar) {
    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');

    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(currentState) {
        $scope.isAnnotationSidebarExpanded = currentState;

        if (currentState) {

            // TODO: perche' 2 classi?
            // TODO: toggleClass() ? 
            // --- non mi sembrava adeguato per questo caso, parliamone
            container.removeClass( 'pnd-annotation-sidebar-collapsed' );
            body.removeClass( 'pnd-annotation-sidebar-coll-active' );

            container.addClass( 'pnd-annotation-sidebar-expanded' );
            body.addClass( 'pnd-annotation-sidebar-exp-active' );
        } else {
            container.removeClass( 'pnd-annotation-sidebar-expanded' );
            body.removeClass( 'pnd-annotation-sidebar-exp-active' );

            container.addClass( 'pnd-annotation-sidebar-collapsed' ); 
            body.addClass( 'pnd-annotation-sidebar-coll-active' );
        }
    });

    AnnotationSidebar.log('Controller Run');
});