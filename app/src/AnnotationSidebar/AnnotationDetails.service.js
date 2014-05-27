/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONDETAILSDEFAULTS', {
    iconDefault: 'pnd-icon pnd-icon-eye',
    iconImage: 'pnd-icon pnd-icon-camera',
    iconText: 'pnd-icon pnd-icon-align-center',
    iconWebPage: 'pnd-icon-file-text',
    iconEntity: 'pnd-icon pnd-icon-code-fork',

    classDefault: 'pnd-item-default',
    classImage: 'pnd-item-image',
    classText: 'pnd-item-text',
    classWebPage: 'pnd-item-web-page',
    classEntity: 'pnd-item-entity',

    debug: false
})
.service('AnnotationDetails', function($rootScope, $filter,
                                       BaseComponent, AnnotationsExchange, TypesHelper,
                                       ANNOTATIONDETAILSDEFAULTS) {
    
    var annotationDetails = new BaseComponent('AnnotationDetails', ANNOTATIONDETAILSDEFAULTS);

    // ... 

    annotationDetails.log('Component running');
    return annotationDetails;
});