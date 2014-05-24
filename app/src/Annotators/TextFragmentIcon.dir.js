angular.module('Pundit2.Annotators')
.directive('textFragmentIcon', function(TextFragmentAnnotator, ContextualMenu, XpointersHelper) {
    return {
        restrict: 'E',
        scope: {
            fragment: '@'
        },
        templateUrl: 'src/Annotators/TextFragmentIcon.dir.tmpl.html',
        replace: true,
        link: function(scope, element /*, attrs */) {

            scope.textFragmentIconClass = XpointersHelper.options.textFragmentIconClass;

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
                ContextualMenu.show(event.pageX, event.pageY, scope.item, TextFragmentAnnotator.options.cMenuType);
            };

        }
    };
});