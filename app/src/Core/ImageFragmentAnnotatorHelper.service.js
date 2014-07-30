angular.module('Pundit2.Core')
.service('ImageFragmentAnnotatorHelper', function($rootScope, $modal, $window, BaseComponent, Config, ContextualMenu) {
    
    var imageFragmentHelper = new BaseComponent("ImageFragmentAnnotatorHelper");

    var msg = {
        close: 'ia-closed'
    };

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

    $window.addEventListener('message', function(e) {
        if (e.data === msg.close) {
            close();
        }
    });

    var overflow;
    var open = function() {
        // add iframe to the page
        angular.element("[data-ng-app='Pundit2']").after(template);
        // disable page scroll
        overflow = angular.element('body').css('overflow');
        angular.element('body').css('overflow', 'hidden');
    };

    var close = function() {
        // restore overflow
        angular.element('body').css('overflow', overflow);
        // remove iframe
        angular.element('.pnd-image-fragment-frame').remove();
    };

    return imageFragmentHelper;
});