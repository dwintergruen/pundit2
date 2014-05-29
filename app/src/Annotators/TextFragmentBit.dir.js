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
                element.addClass('pnd-textfragment-highlight');
            };
            scope.clear = function() {
                element.removeClass('pnd-textfragment-highlight');
            };

            scope.hide = function() {
                element.addClass('pnd-textfragment-hidden');
            };
            scope.show = function() {
                element.removeClass('pnd-textfragment-hidden');
            };

        } // link()
    };
});