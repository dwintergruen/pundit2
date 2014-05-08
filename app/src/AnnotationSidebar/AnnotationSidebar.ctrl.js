/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, AnnotationSidebar) {

    var container = angular.element('.pnd-annotation-sidebar-container');
    container.css({
        'width' : AnnotationSidebar.getWidth()
    });

    /* Test per i watch */
    // $scope.isAnnotationSidebarCollapsed = AnnotationSidebar.isAnnotationSidebarCollapsed();

    // $scope.$watch(function() {
    //     return AnnotationSidebar.isAnnotationSidebarCollapsed();
    // }, function(currentState) {
    //     $scope.isAnnotationSidebarCollapsed = currentState;
    // });

    $scope.$watch(function() {
        return AnnotationSidebar.getWidth();
    }, function(width) {
        container.css({
            'width' : width
        });
    });

    AnnotationSidebar.log('Controller Run');
});