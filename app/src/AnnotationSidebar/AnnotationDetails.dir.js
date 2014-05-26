/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.directive('annotationDetails', function(AnnotationSidebar) {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/AnnotationSidebar/AnnotationDetails.dir.tmpl.html',
        controller: 'AnnotationDetailsCtrl',
    };
});