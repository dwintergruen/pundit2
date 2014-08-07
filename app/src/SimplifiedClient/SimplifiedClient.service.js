angular.module('Pundit2.SimplifiedClient')

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