angular.module('Pundit2.ItemPreview')
    .directive('itemPreview', function() {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: "src/ItemPreview/DashboardPreview.dir.tmpl.html",
            link: function(/* scope, el, attrs, ctrl */) {
                // Stuff to do on link? read some conf?

            }
        };
    });
