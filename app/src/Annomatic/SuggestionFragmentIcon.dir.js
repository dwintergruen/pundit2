angular.module('Pundit2.Annomatic')
.directive('suggestionFragmentIcon', function(TextFragmentAnnotator, Annomatic, $popover) {
    return {
        restrict: 'E',
        scope: {
            fragment: '@'
        },
        templateUrl: 'src/Annomatic/SuggestionFragmentIcon.dir.tmpl.html',
        replace: true,
        link: function(scope, element) {

            // Common for all icons
            scope.textFragmentIconClass = TextFragmentAnnotator.options.annotationIconClass;

            // For suggestions fragments
            scope.iconClass = TextFragmentAnnotator.options.suggestionIconClass;

            // Will use the icon to calculate this fragment height with respect to
            // the document
            scope.element = element;

            // Add this icon to the FragmentAnnotator, he will supply this scope with
            // the .item we belong to
            TextFragmentAnnotator.addFragmentIcon(scope);

            // Let's initialize the popover, tell annomatic we exist etc..
            var init = function() {
                scope.uri = scope.item.uri;
                scope.num = Annomatic.ann.uriToNumMap[scope.uri];

                Annomatic.ann.autoAnnScopes[scope.num] = scope;

                scope.popover = $popover(
                    scope.element,
                    {
                        content: ""+scope.num,
                        template: 'src/Annomatic/AnnotationPopover.tmpl.html',
                        trigger: 'manual'
                    }// init()
                );

            };
            init();

            // TODO: move this to its own controller?
            scope.mouseoverHandler = function() {
                TextFragmentAnnotator.highlightById(scope.fragment);
            };

            scope.mouseoutHandler = function() {
                TextFragmentAnnotator.clearHighlightById(scope.fragment);
            };

            scope.clickHandler = function() {
                if (Annomatic.ann.byNum[scope.num].hidden) { return; }

                if (!scope.popover.$isShown) {
                    scope.show();
                } else {
                    scope.hide();
                }
            };

            scope.show = function() {
                if (scope.popover.$isShown === true) {
                    return;
                }
                Annomatic.closeAll();
                Annomatic.setState(scope.num, 'active');
                scope.popover.show();
            };

            scope.hide = function() {
                if (scope.popover.$isShown === false) {
                    return;
                }
                Annomatic.setLastState(scope.num);
                scope.popover.hide();
            };


        } // link()
    };
});