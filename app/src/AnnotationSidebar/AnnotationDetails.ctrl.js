/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationDetailsCtrl', function($scope, AnnotationSidebar, AnnotationDetails, 
        AnnotationsExchange, ItemsExchange, TypesHelper) {

    var currentId = $scope.id;
    AnnotationDetails.addAnnotationReference($scope);

    $scope.annotation = AnnotationDetails.getAnnotationDetails(currentId);

    $scope.toggleAnnotation = function(){
        AnnotationDetails.toggleAnnotationView(currentId);
    };

    $scope.isUserToolShowed = function() {
        return AnnotationDetails.isUserToolShowed($scope.annotation.creator);
    };

    AnnotationDetails.log('Controller Details Run');
});