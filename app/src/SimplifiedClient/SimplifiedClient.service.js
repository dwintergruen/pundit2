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
 * run in standard mode.
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

.service('SimplifiedClient', function(BaseComponent, $rootScope,
    MyPundit, MyItems, AnnotationsCommunication, TextFragmentAnnotator, Consolidation, ItemPopover){

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
        root.append('<button class="btn btn-info" ng-click="toggleAnnotation()">Show or Hide Annotation</button>');
    };

    var isAnnotationVisible = true;
    $rootScope.toggleAnnotation = function() {
        ItemPopover.hide();
        if (isAnnotationVisible) {
            Consolidation.wipe();
        } else {
            Consolidation.consolidateAll();
        }
        isAnnotationVisible = !isAnnotationVisible;
    };

    sc.boot = function() {

        fixRootNode();

        AnnotationsCommunication.getAnnotations();

    };

    return sc;
});