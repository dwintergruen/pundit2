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

    annotationDetails.getItemIcon = function(item) {

        if (typeof(item) === "undefined" || item === null) {
            return annotationDetails.options.iconDefault;
        } else if (item.isImage() || item.isImageFragment()) {
            return annotationDetails.options.iconImage;
        } else if (item.isTextFragment()) {
            return annotationDetails.options.iconText;
        } else if (item.isWebPage()) {
            return annotationDetails.options.iconWebPage;
        } else if (item.isEntity()) {
            return annotationDetails.options.iconEntity;
        }

        return annotationDetails.options.iconDefault;
    };

    annotationDetails.getItemClass = function(item) {

        if (typeof(item) === "undefined" || item === null) {
            return annotationDetails.options.classDefault;
        } else if (item.isImage() || item.isImageFragment()) {
            return annotationDetails.options.classImage;
        } else if (item.isTextFragment()) {
            return annotationDetails.options.classText;
        } else if (item.isWebPage()) {
            return annotationDetails.options.classWebPage;
        } else if (item.isEntity()) {
            return annotationDetails.options.classEntity;
        }

        return annotationDetails.options.classDefault;
    };

    annotationDetails.log('Component running');
    return annotationDetails;
});