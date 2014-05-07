/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONSIDEBARDEFAULTS', {
    sidebarCollWidth: 30,
    sidebarExpWidth: 100,
    debug: false
})
.service('AnnotationSidebar', function(BaseComponent, ANNOTATIONSIDEBARDEFAULTS) {
    
    var annotationSidebar = new BaseComponent('AnnotationSidebar', ANNOTATIONSIDEBARDEFAULTS);

    annotationSidebar.log('Component running');
    return annotationSidebar;
});