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
    NotebookExchange, ItemsExchange, AnnotationsExchange, NotebookCommunication, Consolidation,
    ContextualMenu, Toolbar, Dashboard, NotebookComposer,
    $modal, $timeout) {

    var myNotebooksContainer = new BaseComponent('MyNotebooksContainer', MYNOTEBOOKSCONTAINERDEFAULTS);

    // this service is injected inside client and controller
    // to read the passed configuration and initialize notebooks contextual menu actions

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
                // delete notebook is a dangerous action
                // it also remove all contained annotation
                openConfirmModal(nt);              
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
                // open dashobard
                if(!Dashboard.isDashboardVisible()){
                    Dashboard.toggle();
                }
                // then swicth to notebook composer tab
                $rootScope.$emit('change-show-tabs', NotebookComposer.options.clientDashboardTabTitle);
                NotebookComposer.setNotebookToEdit(nt);
                // TODO open if the panel is collapsed
            }
        });

    }; // initContextualMenu()

    // When all modules have been initialized, services are up, Config are setup etc..
    $rootScope.$on('pundit-boot-done', function() {
        initContextualMenu();
    });

    // confirm modal
    var modalScope = $rootScope.$new();

    modalScope.titleMessage = "Delete Notebook"

    // confirm btn click
    modalScope.confirm = function() {
        
        Toolbar.setLoading(true);
        // remove notebook and all annotation contained in it
        NotebookCommunication.deleteNotebook(modalScope.notebook.id).then(function(){
            // success
            modalScope.notifyMessage = "Notebook "+modalScope.notebook.label+" correctly deleted.";
            AnnotationsExchange.removeAnnotationByNotebookId(modalScope.notebook.id);
            Consolidation.consolidateAll();
            Toolbar.setLoading(false);
            $timeout(function(){
                confirmModal.hide();
            }, 3000);
        }, function(){
            // error
            modalScope.notifyMessage = "Error impossible to delete this notebook, please retry.";
            Toolbar.setLoading(false);
            $timeout(function(){
                confirmModal.hide();
            }, 1000);
        });

    };

    // cancel btn click
    modalScope.cancel = function() {
        confirmModal.hide();
    };

    var confirmModal = $modal({
        container: "[data-ng-app='Pundit2']",
        template: 'src/Core/confirm.modal.tmpl.html',
        show: false,
        backdrop: 'static',
        scope: modalScope
    });

    // open modal
    var openConfirmModal = function(nt){
        // promise is needed to open modal when template is ready
        modalScope.notifyMessage = "Are you sure you want to delete this notebook? will also remove all the annotation contained in it.";
        modalScope.notebook = nt;
        confirmModal.$promise.then(confirmModal.show);
    };

    return myNotebooksContainer;

});