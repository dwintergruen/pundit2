/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONSIDEBARDEFAULTS', {
    isAnnotationSidebarExpanded: false,
    sidebarCollWidth: 30,
    sidebarExpWidth: 300,
    debug: false
})
.service('AnnotationSidebar', function(BaseComponent, ANNOTATIONSIDEBARDEFAULTS) {
    
    var annotationSidebar = new BaseComponent('AnnotationSidebar', ANNOTATIONSIDEBARDEFAULTS);

    var state = {
        isExpanded: annotationSidebar.options.isAnnotationSidebarExpanded,
        sidebarWidth: annotationSidebar.options.sidebarCollWidth
    };

    annotationSidebar.toggle = function(){
        if (state.isExpanded){
            state.sidebarWidth = annotationSidebar.options.sidebarCollWidth;
        } else {
            state.sidebarWidth = annotationSidebar.options.sidebarExpWidth;
        }
        state.isExpanded = !state.isExpanded;
    };
    annotationSidebar.isAnnotationSidebarExpanded = function(){
        return state.isExpanded;
    };
    annotationSidebar.getWidth = function(){
        return state.sidebarWidth;
    };
    

    annotationSidebar.log('Component running');
    return annotationSidebar;
});