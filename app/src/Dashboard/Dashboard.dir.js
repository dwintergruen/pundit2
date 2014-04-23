angular.module('Pundit2.Dashboard')
.directive('dashboard', function() {
    return {
        restrict: 'E',
        scope: { },
        templateUrl: "src/Dashboard/Dashboard.dir.tmpl.html",
        link: function(/* scope, el, attrs, ctrl */) {
            // Stuff to do on link? read some conf?
        }
    };
});