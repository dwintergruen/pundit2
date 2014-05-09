/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.directive('annotationSidebar', function(AnnotationSidebar) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'src/AnnotationSidebar/AnnotationSidebar.dir.tmpl.html',
        controller: 'AnnotationSidebarCtrl',
        link: function(scope/*, element, attrs*/) {

            var body = angular.element('body');
            body.css({
                '-webkit-transition-duration': '1s, 1s, 1s',
                '-moz-transition-duration': '1s, 1s, 1s',
                '-o-transition-duration': '1s, 1s, 1s',
                'transition-duration': '1s, 1s, 1s'
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
                if (AnnotationSidebar.isAnnotationSidebarExpanded()){
                    body.css({
                        'margin-right': width
                    });
                } else {
                    body.css({
                        'margin-right': 0
                    });
                }
                container.css({
                    'width': width
                });
            });

        }
    };
});