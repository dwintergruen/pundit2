angular.module('Pundit2.Annomatic')
.directive('suggestionFragmentIcon', function(TextFragmentAnnotator, Annomatic, XpointersHelper, Config, ItemsExchange) {
    return {
        restrict: 'E',
        scope: {
            fragment: '@'
        },
        templateUrl: 'src/Annomatic/SuggestionFragmentIcon.dir.tmpl.html',
        replace: true,
        link: function(scope, element /*, attrs */) {

            // Common for all icons
            scope.textFragmentIconClass = TextFragmentAnnotator.options.annotationIconClass;

            // For suggestions fragments
            scope.iconClass = TextFragmentAnnotator.options.suggestionIconClass;

            // Will use the icon to calculate this fragment height with respect to
            // the document
            scope.element = element;
            TextFragmentAnnotator.addFragmentIcon(scope);

            // TODO: move this to its own controller?
            scope.mouseoverHandler = function() {
                TextFragmentAnnotator.highlightById(scope.fragment);
            };

            scope.mouseoutHandler = function() {
                TextFragmentAnnotator.clearHighlightById(scope.fragment);
            };

            scope.clickHandler = function(event) {
                console.log('Annomatic something .. ');
            };

        }
    };
});