angular.module('Pundit2.AnnotationSidebar')

.directive('annotationDetails', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            broken: '=broken'
        },
        templateUrl: 'src/AnnotationSidebar/AnnotationDetails.dir.tmpl.html',
        controller: 'AnnotationDetailsCtrl'
            // require: '^annotationSidebar',
            // link: function(scope, elem, attrs, controllerInstance) {
            //     scope.annotationSidebarCtrl = controllerInstance;
            // }
    };
});