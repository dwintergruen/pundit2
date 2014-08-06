angular.module('Pundit2.AnnotationSidebar')
.directive('annotationSidebar', function(AnnotationSidebar) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'src/AnnotationSidebar/AnnotationSidebar.dir.tmpl.html',
        controller: 'AnnotationSidebarCtrl',
        link: function(/*scope, element, attrs*/) {
            angular.element('body').addClass(AnnotationSidebar.options.bodyClass);
        }
    };
});