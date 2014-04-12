angular.module('Pundit2.Core')
.constant('CONFIGDEFAULTS', {
    annotationServerBaseURL: 'http://demo-cloud.as.thepund.it:8080/annotationserver/',
    vocabularies: [],
    useBasicRelations: true,
    modules: {
        selectors: {
            'Freebase': {
                label: 'Freebase', active: true
            },
            'DBPedia': {
                label: 'DBPedia', active: false
            }
        },
        
        'AnalyticsHelper': {
            active: true
        },
        'pundit.XpointersHelper': {
            // Node name and class used to wrap our annotated content
            wrapNodeName: 'span',
            wrapNodeClass: 'cons',

            // Class used on a container to indicate it's a named content: xpointers
            // will start from that node
            contentClasses: ['pundit-content'],

            // Nodes with these classes will be ignored when building xpointers
            // and consolidating annotations
            ignoreClasses: ['cons', 'pundit-icon-annotation']
        }
    }
    
})
.factory('Config', function($rootScope, $timeout, CONFIGDEFAULTS) {
    var config = {};
    
    config = angular.extend(config, CONFIGDEFAULTS);
    
    return config;
});