angular.module('Pundit2.MyNotebooksContainer')
.constant('MYNOTEBOOKSCONTAINERDEFAULTS', {

    clientDashboardTemplate: "src/Lists/MyNotebooksContainer/ClientMyNotebooksContainer.tmpl.html",

    clientDashboardPanel: "lists",

    clientDashboardTabTitle: "My Notebooks",

    cMenuType: 'myNotebooks',

    container: 'myNotebooks',

    inputIconSearch: 'pnd-icon-search',

    inputIconClear: 'pnd-icon-times'
    
})
.service('MyNotebooksContainer', function($rootScope, MYNOTEBOOKSCONTAINERDEFAULTS, BaseComponent,
    ContextualMenu, NotebookExchange, ItemsExchange, NotebookCommunication, Consolidation, Toolbar, AnnotationsExchange, NotebookComposer, Dashboard) {

    var myNotebooksContainer = new BaseComponent('MyNotebooksContainer', MYNOTEBOOKSCONTAINERDEFAULTS);

    // used only to configuration, this service is injected inside client and controller
    // to read the passed configuration

    var initContextualMenu = function() {

        // TODO: sanity checks on Config.modules.* ? Are they active? Think so??
        var cMenuTypes = [ myNotebooksContainer.options.cMenuType ];

        ContextualMenu.addAction({
            name: 'setAsPrivate',
            type: cMenuTypes,
            label: "Set Notebook as Private",
            priority: 100,
            showIf: function(nt) {
                return nt.visibility === "public";
            },
            action: function(nt) {
                Toolbar.setLoading(true);
                NotebookCommunication.setPrivate(nt.id).then(function(){
                    Toolbar.setLoading(false);
                });
            }
        });

        ContextualMenu.addAction({
            name: 'setAsPublic',
            type: cMenuTypes,
            label: "Set Notebook as Public",
            priority: 100,
            showIf: function(nt) {
                return nt.visibility === "private";
            },
            action: function(nt) {
                Toolbar.setLoading(true);
                NotebookCommunication.setPublic(nt.id).then(function(){
                    Toolbar.setLoading(false);
                });
            }
        });

        ContextualMenu.addAction({
            name: 'setAsCurrent',
            type: cMenuTypes,
            label: "Set Notebook as Current",
            priority: 100,
            showIf: function(nt) {
                return !nt.isCurrent();
            },
            action: function(nt) {
                Toolbar.setLoading(true);
                NotebookCommunication.setCurrent(nt.id).then(function(){
                    Toolbar.setLoading(false);
                });
            }
        });

        ContextualMenu.addAction({
            name: 'deleteNotebook',
            type: cMenuTypes,
            label: "Delete Notebook",
            priority: 100,
            showIf: function(nt) {
                return !nt.isCurrent();
            },
            action: function(nt) {
                Toolbar.setLoading(true);
                NotebookCommunication.deleteNotebook(nt.id).then(function(){
                    AnnotationsExchange.removeAnnotationByNotebookId(nt.id);
                    Consolidation.consolidateAll();
                    Toolbar.setLoading(false);
               });                
            }
        });

        ContextualMenu.addAction({
            name: 'editNotebook',
            type: cMenuTypes,
            label: "Edit Notebook",
            priority: 101,
            showIf: function(nt) {
                return true;
            },
            action: function(nt) {
                // TODO expose API on notebooks composer
                if(!Dashboard.isDashboardVisible()){
                    Dashboard.toggle();
                }
                $rootScope.$emit('change-show-tabs', NotebookComposer.options.clientDashboardTabTitle);
                NotebookComposer.setNotebookToEdit(nt);
            }
        });

    }; // initContextualMenu()

    // When all modules have been initialized, services are up, Config are setup etc..
    $rootScope.$on('pundit-boot-done', function() {
        initContextualMenu();
    });

    return myNotebooksContainer;

});