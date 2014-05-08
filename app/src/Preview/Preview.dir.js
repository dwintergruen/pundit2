angular.module('Pundit2.Preview')
    .directive('preview', function() {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: "src/Preview/DashboardPreview.dir.tmpl.html",
            link: function(/* scope, el, attrs, ctrl */) {
                // Stuff to do on link? read some conf?

            }
        };
    });
