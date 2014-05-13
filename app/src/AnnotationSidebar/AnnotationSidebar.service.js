/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONSIDEBARDEFAULTS', {
    isAnnotationSidebarExpanded: false,
    bodyClass: 'pnd-annotation-sidebar-active',
    bodyExpandedClass: 'pnd-annotation-sidebar-expanded',
    bodyCollapsedClass: 'pnd-annotation-sidebar-collapsed',
    sidebarExpandedClass: 'pnd-annotation-sidebar-expanded',
    sidebarCollapsedClass: 'pnd-annotation-sidebar-collapsed',

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDomTemplate: "src/AnnotationSidebar/ClientAnnotationSidebar.tmpl.html",

    debug: false
})
.service('AnnotationSidebar', function($rootScope, $timeout, BaseComponent, AnnotationsExchange, ANNOTATIONSIDEBARDEFAULTS) {
    
    var annotationSidebar = new BaseComponent('AnnotationSidebar', ANNOTATIONSIDEBARDEFAULTS);

    var state = {
        isExpanded: annotationSidebar.options.isAnnotationSidebarExpanded,
        allAnnotations: []
    };

    annotationSidebar.toggle = function(){
        state.isExpanded = !state.isExpanded;
    };
    annotationSidebar.isAnnotationSidebarExpanded = function(){
        return state.isExpanded;
    };

    // temp test
    annotationSidebar.qualcosaAnnotations = function(annotations){
        angular.forEach(annotations, function(value, key){
            console.log(key + ': ' + value.creatorName);
        });    
    };

    var timeoutPromise;
    $rootScope.$watch(function() {
        return AnnotationsExchange.getAnnotations();
    }, function(annotations) {
        if (timeoutPromise) {
            $timeout.cancel(timeoutPromise);
        }
        timeoutPromise = $timeout(function() {
            state.allAnnotations = annotations;
            console.log("--> ",annotations);
            angular.forEach(annotations, function(value, key){
                console.log(key + ': ' + value.creatorName);
            });
        }, 300);
    }, true);



    annotationSidebar.log('Component running');
    return annotationSidebar;
});