angular.module('Pundit2.AnnotationSidebar')
.directive('annotationSidebar', function(AnnotationSidebar) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "src/AnnotationSidebar/AnnotationSidebar.dir.tmpl.html",
        controller: "AnnotationSidebarCtrl",
        link: function(scope, element, attrs) {

            var body = angular.element('body');
            body.css({
                'margin-right': AnnotationSidebar.getWidth()
            });

            var container = angular.element('.pnd-annotation-sidebar-container');
            container.css({
                'width': AnnotationSidebar.getWidth()
            });


            scope.$watch(function() {
                return AnnotationSidebar.isAnnotationSidebarExpanded();
            }, function(currentState) {
                scope.isAnnotationSidebarExpanded = currentState;
            });

            scope.$watch(function() {
                return AnnotationSidebar.getWidth();
            }, function(width) {
                body.css({
                    'margin-right': width
                });
                container.css({
                    'width': width
                });
            });

        }
    };
});