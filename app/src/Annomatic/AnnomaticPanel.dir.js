angular.module('Pundit2.Annomatic')
.directive('annomaticPanel', function() {
    return {
        restrict: 'AE',
        scope: {
            first: '=',
            second: '&funName'
        },
        // replace: true,
        templateUrl: "src/Annomatic/AnnomaticPanel.dir.tmpl.html",
        link: function(/* scope, el, attrs, ctrl */) {
            // Stuff to do on link? read some conf?
        }
    };
});