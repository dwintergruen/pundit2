angular.module('Pundit2.Annotators')
.directive('imgMenu', function($rootScope, ContextualMenu, Toolbar, ImageHandler, ItemsExchange) {
    return {
        restrict: 'E',
        scope: {
            ref: '@'
        },
        templateUrl: 'src/Annotators/ImgMenu.dir.tmpl.html',
        replace: true,
        link: function(scope, element , attrs) {

            // reference to image dom element
            scope.image = angular.element('.'+scope.ref);
            // reference to directive dom element
            scope.element = element;
            // directive is showed after the consolidation of the page has been completed
            scope.visible = false;
            // item generated from image reference
            scope.item = null;

            // read image coordinate and position the directive
            var placeMenu = function() {
                var imgPos = scope.image.position();
                scope.visible = true;
                scope.element.css({
                    position: 'absolute',
                    border: '1px solid khaki',
                    left: imgPos.left,
                    top: imgPos.top
                });
            };
            $rootScope.$on('consolidation-completed', placeMenu);
            
            scope.clickHandler = function(evt) {                
                
                if (scope.item === null) {
                    // create item only once
                    scope.item = ImageHandler.createItemFromImage(scope.image[0]);
                    ItemsExchange.addItemToContainer(scope.item, ImageHandler.options.container);
                }

                // TODO what to do in template mode?
                if (Toolbar.isActiveTemplateMode()) {
                    return;
                }

                ContextualMenu.show(evt.pageX, evt.pageY, scope.item, ImageHandler.options.cMenuType);
                
            };

        } // link()
    };
});