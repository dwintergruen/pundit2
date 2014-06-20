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
    ContextualMenu, NotebookExchange, ItemsExchange, NotebookCommunication) {

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
                NotebookCommunication.setPrivate(nt.id);
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
                NotebookCommunication.setPublic(nt.id);
            }
        });

        ContextualMenu.addAction({
            name: 'setAsCurrent',
            type: cMenuTypes,
            label: "Set Notebook as Current",
            priority: 100,
            showIf: function(item) {
                return true;
            },
            action: function(item) {
    
            }
        });

        ContextualMenu.addAction({
            name: 'deleteNotebook',
            type: cMenuTypes,
            label: "Delete Notebook",
            priority: 100,
            showIf: function(item) {
                // TODO return false if is current
                return true;
            },
            action: function(nb) {
                NotebookCommunication.deleteNotebook(nb.id);
            }
        });

    }; // initContextualMenu()

    // When all modules have been initialized, services are up, Config are setup etc..
    $rootScope.$on('pundit-boot-done', function() {
        initContextualMenu();
    });

    return myNotebooksContainer;

});