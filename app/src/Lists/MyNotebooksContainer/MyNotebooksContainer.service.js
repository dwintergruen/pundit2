angular.module('Pundit2.MyNotebooksContainer')

.constant('MYNOTEBOOKSCONTAINERDEFAULTS', {

    clientDashboardTemplate: "src/Lists/MyNotebooksContainer/ClientMyNotebooksContainer.tmpl.html",

    clientDashboardPanel: "lists",

    clientDashboardTabTitle: "My notebooks",

    cMenuType: 'myNotebooks',

    container: 'myNotebooks',

    inputIconSearch: 'pnd-icon-search',

    inputIconClear: 'pnd-icon-times'

})

.service('MyNotebooksContainer', function($rootScope, MYNOTEBOOKSCONTAINERDEFAULTS, BaseComponent, EventDispatcher,
    NotebookExchange, ItemsExchange, PageItemsContainer, AnnotationsExchange, NotebookCommunication, Consolidation,
    ContextualMenu, Config, Dashboard, NotebookComposer, AnnotationsCommunication, NameSpace,
    $modal, $timeout, $window) {

    var myNotebooksContainer = new BaseComponent('MyNotebooksContainer', MYNOTEBOOKSCONTAINERDEFAULTS);

    // this service is injected inside client and controller
    // to read the passed configuration and initialize notebooks contextual menu actions

    var initContextualMenu = function() {

        // TODO: sanity checks on Config.modules.* ? Are they active? Think so??
        var cMenuTypes = [myNotebooksContainer.options.cMenuType];

        var lodLive = false;
        if (typeof(Config.lodLive) !== 'undefined' && Config.lodLive.active) {
            lodLive = true;
        }
        var timeline = false;
        if (typeof(Config.timeline) !== 'undefined' && Config.timeline.active) {
            timeline = true;
        }

        ContextualMenu.addAction({
            name: 'openNTlod',
            type: cMenuTypes,
            label: "Open graph",
            priority: 102,
            showIf: function() {
                return lodLive;
            },
            action: function(nt) {
                $window.open(Config.lodLive.baseUrl + Config.pndPurl + 'notebook/' + nt.id, '_blank');
            }
        });

        ContextualMenu.addAction({
            name: 'openTM',
            type: cMenuTypes,
            label: "Open Timeline",
            priority: 102,
            showIf: function() {
                return timeline;
            },
            action: function(nt) {
                $window.open(Config.timeline.baseUrl + 'notebook-ids=' + nt.id + '&namespace=' + Config.pndPurl + 'notebook/' + '&api=' + NameSpace.asOpen, '_blank');
            }
        });

        ContextualMenu.addAction({
            name: 'setAsPrivate',
            type: cMenuTypes,
            label: "Set notebook as private",
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
            label: "Set notebook as public",
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
            label: "Set notebook as current",
            priority: 100,
            showIf: function(nt) {
                return !nt.isCurrent();
            },
            action: function(nt) {
                NotebookCommunication.setCurrent(nt.id);
            }
        });

        ContextualMenu.addAction({
            name: 'deleteNotebook',
            type: cMenuTypes,
            label: "Delete notebook",
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
            label: "Edit notebook",
            priority: 101,
            showIf: function() {
                return true;
            },
            action: function(nt) {
                // open dashobard
                if (!Dashboard.isDashboardVisible()) {
                    Dashboard.toggle();
                }
                // then swicth to notebook composer tab

                //EventDispatcher.sendEvent('Dashboard.showTab', NotebookComposer.options.clientDashboardTabTitle);
                EventDispatcher.sendEvent('MyNotebooksContainer.editNotebook', NotebookComposer.options.clientDashboardTabTitle);
                NotebookComposer.setNotebookToEdit(nt);
                // TODO open if the panel is collapsed
            }
        });

    }; // initContextualMenu()

    // When all modules have been initialized, services are up, Config are setup etc..
    EventDispatcher.addListener('Client.boot', function() {
        initContextualMenu();
    });

    // confirm modal
    var modalScope = $rootScope.$new();

    modalScope.titleMessage = "Delete notebook";

    // confirm btn click
    modalScope.confirm = function() {

        // remove notebook and all annotation contained in it
        NotebookCommunication.deleteNotebook(modalScope.notebook.id).then(function() {
            // success
            modalScope.notifyMessage = "Notebook " + modalScope.notebook.label + " correctly deleted.";
            // remove annotations that belong to the notebook deleted
            AnnotationsExchange.wipe();
            // wipe page items
            ItemsExchange.wipeContainer(PageItemsContainer.options.container);
            // update page items by update all annotations info
            // item can belong to more than one annotation or to my items
            // this function use cache to skip real http calls
            // all the informations is cache at initialization time
            AnnotationsCommunication.getAnnotations();

            $timeout(function() {
                confirmModal.hide();
            }, 1000);
        }, function() {
            // error
            modalScope.notifyMessage = "Error impossible to delete this notebook, please retry.";
            $timeout(function() {
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
        template: 'src/Core/Templates/confirm.modal.tmpl.html',
        show: false,
        backdrop: 'static',
        scope: modalScope
    });

    // open modal
    var openConfirmModal = function(nt) {
        // promise is needed to open modal when template is ready
        modalScope.notifyMessage = "Are you sure you want to delete this notebook? will also remove all the annotation contained in it.";
        modalScope.notebook = nt;
        confirmModal.$promise.then(confirmModal.show);
    };

    return myNotebooksContainer;

});