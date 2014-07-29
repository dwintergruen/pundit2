angular.module('Pundit2.Core')
.service('ImageFragmentAnnotatorHelper', function($rootScope, $modal, BaseComponent, Config, ContextualMenu) {
    
    var imageFragmentHelper = new BaseComponent("ImageFragmentAnnotatorHelper");

    var windowCallback;

    var template = '<iframe class="pnd-image-fragment-frame" width="620" height="500" src="http://demo-image-fragment-annotator.kissr.com" scrolling="no" frameborder="0" allowfullscreen></iframe>';

    var initContextualMenu = function() {
        ContextualMenu.addAction({
            type: [Config.modules.ImageHandler.cMenuType],
            name: 'openImageFragmentAnnotator',
            label: 'Annotate a portion of this image',
            showIf: function(item) {
                return true;
            },
            priority: 99,
            action: function(item) {
                open();
            }
        });
    };

    // When all modules have been initialized, services are up, Config are setup etc..
    $rootScope.$on('pundit-boot-done', function() {
        // check configuration
        if (Config.imageFragmentAnnotator.active) {
            initContextualMenu();
        }
    });

    var open = function() {
        // add ifram to the page
        angular.element("[data-ng-app='Pundit2']").after(template);
        // disable page scroll
        angular.element('body').css('overflow', 'hidden');
    };

    var close = function() {

    };

    return imageFragmentHelper;
});