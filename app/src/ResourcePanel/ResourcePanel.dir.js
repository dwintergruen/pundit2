angular.module('Pundit2.ResourcePanel')
.directive('resourcePanel', function() {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: "src/ResourcePanel/ResourcePanel.dir.tmpl.html",
            link: function(/*scope, el  attrs, ctrl */) {
                // When the directive is rendered, this class will be added
            }
        };
    });