angular.module('Pundit2.Core')
.service('ImageFragmentAnnotatorHelper', function($rootScope, BaseComponent, Config, ContextualMenu) {
    
    var imageFragmentHelper = new BaseComponent("ImageFragmentAnnotatorHelper");

    var windowCallback;

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
                //$window.open('http://demo-image-fragment-annotator.kissr.com/', 'Image Fragment Annotator');
                // angular.element("[data-ng-app='Pundit2']").after('<iframe name="imageFragmentAnnotator" src="http://demo-image-fragment-annotator.kissr.com"></iframe>')
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

    return imageFragmentHelper;
});