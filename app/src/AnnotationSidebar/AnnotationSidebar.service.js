/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONSIDEBARDEFAULTS', {
    isAnnotationSidebarExpanded: false,
    bodyClass: "pnd-annotation-sidebar-coll-active",
    debug: false
})
.service('AnnotationSidebar', function(BaseComponent, ANNOTATIONSIDEBARDEFAULTS) {
    
    var annotationSidebar = new BaseComponent('AnnotationSidebar', ANNOTATIONSIDEBARDEFAULTS);

    var state = {
        isExpanded: annotationSidebar.options.isAnnotationSidebarExpanded
    };

    annotationSidebar.toggle = function(){
        state.isExpanded = !state.isExpanded;
    };
    annotationSidebar.isAnnotationSidebarExpanded = function(){
        return state.isExpanded;
    };

    // TODO: a che/chi serve getWidth?
    annotationSidebar.getWidth = function(){
        return state.sidebarWidth;
    };
    

    annotationSidebar.log('Component running');
    return annotationSidebar;
});