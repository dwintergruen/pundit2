/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, AnnotationSidebar) {
    var body = angular.element('body');
    body.css({
        'margin-right' : AnnotationSidebar.getWidth()
    });

    var container = angular.element('.pnd-annotation-sidebar-container');
    container.css({
        'width' : AnnotationSidebar.getWidth()
    });

    $scope.isAnnotationSidebarExpanded = AnnotationSidebar.isAnnotationSidebarExpanded();

    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(currentState) {
        $scope.isAnnotationSidebarExpanded = currentState;
    });

    $scope.$watch(function() {
        return AnnotationSidebar.getWidth();
    }, function(width) {
        body.css({
            'margin-right' : width
        });
        container.css({
            'width' : width
        });
    });

    AnnotationSidebar.log('Controller Run');
});