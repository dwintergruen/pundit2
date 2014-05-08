/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONSIDEBARDEFAULTS', {
    isAnnotationSidebarCollapsed: true,
    sidebarCollWidth: 30,
    sidebarExpWidth: 100,
    debug: false
})
.service('AnnotationSidebar', function(BaseComponent, ANNOTATIONSIDEBARDEFAULTS) {
    
    var annotationSidebar = new BaseComponent('AnnotationSidebar', ANNOTATIONSIDEBARDEFAULTS);

    var state = {
        isCollapsed: annotationSidebar.options.isAnnotationSidebarCollapsed,
        sidebarWidth: annotationSidebar.options.sidebarCollWidth
    };

    annotationSidebar.toggle = function(){
        if (state.isCollapsed){
            state.sidebarWidth = annotationSidebar.options.sidebarExpWidth;
        } else {
            state.sidebarWidth = annotationSidebar.options.sidebarCollWidth;
        }
        state.isCollapsed = !state.isCollapsed;
    };
    annotationSidebar.isAnnotationSidebarCollapsed = function(){
        return state.isCollapsed;
    };
    annotationSidebar.getWidth = function(){
        return state.sidebarWidth;
    };
    

    annotationSidebar.log('Component running');
    return annotationSidebar;
});