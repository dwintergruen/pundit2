angular.module('Pundit2.NotebookComposer')
.constant('NOTEBOOKCOMPOSERDEFAULTS', {

    clientDashboardTemplate: "src/Tools/NotebookComposer/ClientNotebookComposer.tmpl.html",
    clientDashboardPanel: "tools",
    clientDashboardTabTitle: "Notebooks Composer",
    savingMsg: "We are saving your notebook",
    editingMsg: "We are editing your notebook",
    savingMsgTime: 1250,
    notificationMsgTime: 1500,
    notificationSuccessMsg: "Your notebook has been saved successfully",
    notificationErrorMsg: "We were unable to save your notebook"

})
.service('NotebookComposer', function(BaseComponent, NotebookExchange, NOTEBOOKCOMPOSERDEFAULTS, $q, NotebookCommunication) {

        var notebookComposer = new BaseComponent("NotebookComposer", NOTEBOOKCOMPOSERDEFAULTS);

        // create a notebook
        notebookComposer.createNotebook = function(notebook){
            var promise = $q.defer();
            var statePromise = {};
            var allPromises = [];

            // when the notebook is created, will be set the visibility as private and notebook as current
            // if options are selected by user
            // setPrivate and setCurrent return a promise
            NotebookCommunication.createNotebook(notebook.name).then(function(notebookID){

                if(notebook.visibility === 'private'){
                    var promVisibility = NotebookCommunication.setPrivate(notebookID);
                    allPromises.push(promVisibility);
                }

                if(notebook.current === true){
                    var promCurrent = NotebookCommunication.setCurrent(notebookID);
                    allPromises.push(promCurrent);
                }
                    // create promise will be resolved when all promises are resolved
                    $q.all(allPromises).then(function(){
                       promise.resolve();
                    });

            },
            function(){
                // reject in case of notebook creation fail
                promise.reject("created failed");
            });


            return promise.promise;

       };

        var notebookToEdit = null;

        // edit the name of a notebook
        notebookComposer.editNotebook = function(id, name){

            var promise = $q.defer();

            NotebookCommunication.setName(id, name).then(function(){
                promise.resolve();
            }, function(){
                promise.reject("edited failed");
            });

            return promise.promise;
        };

        // return the notebook that want to edit
        notebookComposer.getNotebookToEdit = function(){
            return notebookToEdit;
        };

        // set the notebook that want to edit
        notebookComposer.setNotebookToEdit = function(notebook){
            notebookToEdit = notebook;
        };

        return notebookComposer;

    });