angular.module('Pundit2.AnnotationSidebar')
.directive('annotationSidebar', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "src/AnnotationSidebar/AnnotationSidebar.dir.tmpl.html",
        controller: "AnnotationSidebarCtrl",
        link: function(/* scope, el, attrs, ctrl */) {
            // Stuff to do on link? read some conf?
        }
    };
});