angular.module('Pundit2.Annotators')
.directive('imgMenu', function($rootScope, NameSpace, ContextualMenu, Toolbar, ImageHandler, ImageAnnotator, ItemsExchange, TemplatesExchange, TripleComposer) {
    return {
        restrict: 'E',
        scope: {
            ref: '@'
        },
        templateUrl: 'src/Annotators/ImgMenu.dir.tmpl.html',
        //replace: true,
        link: function(scope, element) {

            // reference to image dom element
            scope.image = angular.element('.'+scope.ref);
            // reference to directive dom element
            scope.element = element;
            // directive is showed after the consolidation of the page has been completed
            scope.visible = false;
            // item generated from image reference
            scope.item = null;

            scope.$watch(function() {
                return Toolbar.isActiveTemplateMode();
            }, function(active) {
                if (active) {
                    scope.icon = "pnd-icon-plus-circle";
                } else {
                    scope.icon = "pnd-icon-gear";
                }
            });

            // read image coordinate and position the directive
            var placeMenu = function() {
                var imgPos = scope.image.position();
                scope.visible = true;
                scope.element.css({
                    position: 'absolute',
                    color: '#fff',
                    background: 'rgba(0, 0, 0, 0.2)',
                    fontSize: '1.7em',
                    height: '30px',
                    width: '30px',
                    left: imgPos.left,
                    top: imgPos.top
                });
                scope.element.hover(
                    function(){ 
                        $(this).css({
                            color: '#333333',
                            // textShadow: '0px 0 25px #FFCC00'
                        });
                    },
                    function(){ 
                        $(this).css({
                            color: '#fff',
                            // textShadow: 'none'
                        });
                    }
                );
            };
            placeMenu();
            
            scope.clickHandler = function(evt) {

                evt.preventDefault();
                evt.stopPropagation();

                ImageHandler.clearTimeout();
                
                if (scope.item === null) {
                    // create item only once
                    scope.item = ImageHandler.createItemFromImage(scope.image[0]);
                    ItemsExchange.addItemToContainer(scope.item, ImageHandler.options.container);
                }

                if (Toolbar.isActiveTemplateMode()) {
                    var triples = TemplatesExchange.getCurrent().triples;
                    // verify that all predicates admit images as subject
                    // all template triples must be have a predicate
                    for (var i in triples) {
                        if (triples[i].predicate.domain.indexOf(NameSpace.types.image) === -1) {
                            return;
                        }
                    }
                    
                    TripleComposer.addToAllSubject(ItemsExchange.getItemByUri(scope.item.uri));
                    TripleComposer.closeAfterOp();
                    $rootScope.$emit('pnd-save-annotation');
                    return;
                }

                var item = ItemsExchange.getItemByUri(scope.item.uri);
                ContextualMenu.show(evt.pageX, evt.pageY, item, ImageHandler.options.cMenuType);
                
            };

            scope.onMouseOver = function() {
                ImageHandler.clearTimeout();
            };

            scope.onMouseLeave = function() {
                ImageHandler.removeDirective();
            };

        } // link()
    };
});