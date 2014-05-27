angular.module('Pundit2.Annotators')
.directive('textFragmentIcon', function(TextFragmentAnnotator, ContextualMenu,
                                        XpointersHelper, Config, ItemsExchange) {
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

            // To see what kind of item is it, check which container it belongs to
            var amContainer = Config.modules.Annomatic.container,
                piContainer = Config.modules.PageItemsContainer.container,
                miContainer = Config.modules.MyItems.container;

            if (ItemsExchange.isItemInContainer(scope.item, amContainer)) {
                scope.iconClass = TextFragmentAnnotator.options.suggestionIconClass;
                scope.kind = 'annomatic';

            } else if (ItemsExchange.isItemInContainer(scope.item, miContainer) &&
                !ItemsExchange.isItemInContainer(scope.item, piContainer)) {

                scope.iconClass = TextFragmentAnnotator.options.myItemsIconClass;
                scope.kind = "myitem";
            } else {
                scope.iconClass = TextFragmentAnnotator.options.annotationIconClass;
                scope.kind = "annotation";
            }


            // TODO: move this to its own controller?
            scope.mouseoverHandler = function() {
                TextFragmentAnnotator.highlightById(scope.fragment);
            };

            scope.mouseoutHandler = function() {
                TextFragmentAnnotator.clearHighlightById(scope.fragment);
            };

            scope.clickHandler = function(event) {
                if (scope.kind === 'annomatic') {
                    console.log('Annomatic .. ');
                } else {
                    ContextualMenu.show(event.pageX, event.pageY, scope.item, TextFragmentAnnotator.options.cMenuType);
                }
            };

        }
    };
});