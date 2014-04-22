angular.module('Pundit2.Toolbar')
.directive('toolbar', function() {
    return {
        restrict: 'E',
        scope: { },
        templateUrl: "src/Toolbar/Toolbar.dir.tmpl.html",
        link: function(/* scope, el, attrs, ctrl */) {
            // Stuff to do on link? read some conf?
            console.log('toolbar link function invoked');
        }
    };
});