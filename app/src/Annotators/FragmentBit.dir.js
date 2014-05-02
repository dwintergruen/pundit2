angular.module('Pundit2.Annotators')
.directive('fragmentBit', function(TextFragmentAnnotator) {
    return {
        restrict: 'A',
        scope: {
            fragments: '@'
        },
        link: function(scope, element, attrs) {
            TextFragmentAnnotator.addFragmentBit(scope);

            scope.isHigh = false;
            scope.high = function() {
                scope.isHigh = true;
                element.css('outline', '2px solid red');
            };
            scope.reset = function() {
                scope.isHigh = false;
                element.css('outline', '0');
            };

        }
    };
});