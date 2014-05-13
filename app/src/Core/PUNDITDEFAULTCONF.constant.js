// TODO: docs!
angular.module('Pundit2.Core')
.constant('PUNDITDEFAULTCONF', {
    annotationServerBaseURL: 'http://demo-cloud.as.thepund.it:8080/annotationserver/',
    debugAllModules: false,
    vocabularies: [],
    useBasicRelations: true,
    modules: {

        // Modules which requires to be bootstrapped (add stuff to Pundit2's root node or
        // to some Dashboard panel) by the client are listed as .bootModules inside the
        // modules.Client conf object. See CLIENTDEFAULTS
        Client: {
            active: false
        },

        // Modules active by default are activated here with active=true
        Dashboard: {
            active: true
        },
        Toolbar: {
            active: true
        },
        AnnotationSidebar: {
            active: true
        },

        selectors: {
            'Freebase': {
                label: 'Freebase', active: true
            },
            'DBPedia': {
                label: 'DBPedia', active: false
            }
        },
        
        'pundit.AnalyticsHelper': {
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
    
});