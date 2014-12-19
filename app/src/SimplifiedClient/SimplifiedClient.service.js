angular.module('Pundit2.SimplifiedClient')

/**
 * @module punditConfig
 * @ngdoc property
 * @name modules#SimplifiedClient
 *
 * @description
 * `object`
 *
 * Configuration object for SimplifiedClient module. By default this module is not enabled and Pundit
 * run in standard mode. If the moudule is enabled it expose an annotation toggle function trought the PUNDIT
 * global object available on the broswer window object as "window.PUNDIT.simplifiedClient.toggleAnnotation()".
 *
 */

/**
 * @ngdoc property
 * @name modules#SimplifiedClient.active
 *
 * @description
 * `boolean`
 *
 * Default state of the SimplifiedClient module, if it is set to true
 * the client run in simplified mode (only show annotation on the page) otherwise run in standard mode.
 *
 * Default value:
 * <pre> active: false </pre>
 */

.run(function($injector, Config) {
    if (Config.isModuleActive('SimplifiedClient')) {
        var sc = $injector.get('SimplifiedClient');
        sc.boot();
    }
})

.service('SimplifiedClient', function(BaseComponent, $rootScope, $window,
    MyPundit, MyItems, AnnotationsCommunication, TextFragmentAnnotator, Consolidation, ItemPopover) {

    // This service only make a consolidation of the annotation on the page
    // it not have: toolbar, dashboard and siderbar

    var sc = new BaseComponent('SimplifiedClient');

    // Node which will contain every other component
    var root;
    // Verifies that the root node has the wrap class
    var fixRootNode = function() {
        root = angular.element("[data-ng-app='Pundit2']");
        if (!root.hasClass('pnd-wrp')) {
            root.addClass('pnd-wrp');
        }
    };

    // show or hide annotations
    var isAnnotationVisible = true;
    var toggleAnnotation = function() {
        ItemPopover.hide();
        if (isAnnotationVisible) {
            Consolidation.wipe();
        } else {
            Consolidation.consolidateAll();
        }
        isAnnotationVisible = !isAnnotationVisible;
    };

    // expose the api trought the pundit global object
    $window.PUNDIT.simplifiedClient = {
        toggleAnnotation: toggleAnnotation
    };

    sc.boot = function() {
        fixRootNode();
        AnnotationsCommunication.getAnnotations();
    };

    return sc;
});