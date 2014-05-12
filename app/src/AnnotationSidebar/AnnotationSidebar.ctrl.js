/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, AnnotationSidebar) {
    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');

    // Start reading the default
    if (AnnotationSidebar.options.isAnnotationSidebarExpanded) {

    }

    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(currentState, oldState) {
        $scope.isAnnotationSidebarExpanded = currentState;

        if (currentState !== oldState) {
            console.log('valori diversi');
        } else {
            console.log('stesso valore', currentState);
        }

        var bodyClasses = AnnotationSidebar.options.bodyExpandedClass + " " + AnnotationSidebar.options.bodyCollapsedClass;
        container.toggleClass(bodyClasses);
        body.toggleClass(bodyClasses);

        /*
        if (currentState) {

            // TODO: perche' 2 classi?
            // TODO: toggleClass() ? 
            // --- non mi sembrava adeguato per questo caso, parliamone
            container.removeClass( 'pnd-annotation-sidebar-collapsed' );
            body.removeClass( 'pnd-annotation-sidebar-collapsed' );

            container.addClass( 'pnd-annotation-sidebar-expanded' );
            body.addClass( 'pnd-annotation-sidebar-expanded' );
        } else {
            container.removeClass( 'pnd-annotation-sidebar-expanded' );
            body.removeClass( 'pnd-annotation-sidebar-exp-active' );

            container.addClass( 'pnd-annotation-sidebar-collapsed' ); 
            body.addClass( 'pnd-annotation-sidebar-coll-active' );
        }
        */
    });

    AnnotationSidebar.log('Controller Run');
});