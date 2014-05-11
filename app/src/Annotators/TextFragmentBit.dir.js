angular.module('Pundit2.Annotators')
.directive('textFragmentBit', function(TextFragmentAnnotator) {
    return {
        restrict: 'A',
        scope: {
            fragments: '@'
        },
        link: function(scope, element /*, attrs */) {

            // TODO: move this to its own controller?
            TextFragmentAnnotator.addFragmentBit(scope);

            scope.isHigh = false;
            scope.high = function() {
                scope.isHigh = true;
                // TODO: use a class instead
                element.css('background', '#ff931e');
            };
            scope.reset = function() {
                scope.isHigh = false;
                element.css('background', '');
            };

        }
    };
});