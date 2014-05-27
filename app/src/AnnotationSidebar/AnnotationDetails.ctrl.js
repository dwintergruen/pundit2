/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationDetailsCtrl', function($scope, AnnotationSidebar, AnnotationsExchange) {
    $scope.annotation = AnnotationsExchange.getAnnotationById($scope.id);
    
    // console.log($scope.annotation.id);

    AnnotationSidebar.log('Controller Details Run');
});