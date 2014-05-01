angular.module('Pundit2.Dashboard')
.directive('dashboardPanel', function(Dashboard, $document) {
    return {
        // require: "^dashboard",
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@'
        },
        templateUrl: "src/Dashboard/DashboardPanel.dir.tmpl.html",
        link: function(scope, element, attrs) {

            scope.isCollapsed = false;
            scope.minWidth = 100;
            scope.left = 0;
            scope.width = 200;

            scope.toggleCollapse = function() {
                scope.isCollapsed = !scope.isCollapsed;
                if (!scope.isCollapsed) {
                    var foo = {};
                    foo[scope.index] = scope.minWidth;
                    Dashboard.resizeAll(foo);
                } else {
                    Dashboard.resizeAll();
                }
            };

            var lastPageX;
            var moveHandler = function(evt) {
                var deltaX = evt.pageX - lastPageX;
                if (deltaX === 0) { return; }
                lastPageX = evt.pageX;
                if (Dashboard.options.fluidResize)
                    Dashboard.tryToResizeFluid(scope.index, deltaX);
                else
                    Dashboard.tryToResizeCouples(scope.index, deltaX);
            };
            var upHandler = function(evt) {
                $document.off('mousemove', moveHandler);
                $document.off('mouseup', upHandler);
            };

            scope.mouseDownHandler = function(e) {
                lastPageX = e.pageX;
                e.preventDefault();
                $document.on('mousemove', moveHandler);
                $document.on('mouseup', upHandler);
            };



            Dashboard.addPanel(scope);
        }
    };
});