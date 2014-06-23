angular.module('Pundit2.NotebookComposer')
.constant('NOTEBOOKCOMPOSERDEFAULTS', {

    clientDashboardTemplate: "src/Tools/NotebookComposer/ClientNotebookComposer.tmpl.html",
    clientDashboardPanel: "tools",
    clientDashboardTabTitle: "Notebooks Composer",
    savingMsg: "We are saving your notebook",
    savingMsgTime: 1250,
    notificationMsgTime: 1500,
    notificationSuccessMsg: "Your notebook has been saved successfully",
    notificationErrorMsg: "We were unable to save your notebook"

})
.service('NotebookComposer', function(BaseComponent, NotebookExchange, NOTEBOOKCOMPOSERDEFAULTS, $q, NotebookCommunication) {

        var notebookComposer = new BaseComponent("NotebookComposer", NOTEBOOKCOMPOSERDEFAULTS);

        notebookComposer.createNotebook = function(notebook){
            var promise = $q.defer();
            var statePromise = {};

            // create the notebook
            NotebookCommunication.createNotebook(notebook.name).then(
                function(notebookID){

                    statePromise.notebookID = notebookID;
                    // notebook public and not current
                    if(!notebook.current && notebook.visibility === 'public'){
                        promise.resolve(statePromise);

                    // notebook private and not current
                    } else if(!notebook.current && notebook.visibility === 'private'){
                        NotebookCommunication.setPrivate(notebookID).then(function(){
                            statePromise.setPrivate = true;
                            promise.resolve(statePromise);

                        }, function(){
                            statePromise.setPrivate = false;
                            promise.resolve(statePromise);
                        });

                    // notebook public and current
                    } else if(notebook.current && notebook.visibility !== 'private'){
                        NotebookCommunication.setCurrent(notebookID).then(
                            function(){
                                statePromise.setCurrent = true;
                                promise.resolve(statePromise);
                        },
                            function(){
                                statePromise.setCurrent = false;
                                promise.resolve(statePromise);
                        });

                    // notebook private and current
                    } else if(notebook.current && notebook.visibility === 'private'){
                        NotebookCommunication.setCurrent(notebookID).then(
                            function(){
                                statePromise.setCurrent = true;

                                NotebookCommunication.setPrivate(notebookID).then(function(){
                                    statePromise.setPrivate = true;
                                    promise.resolve(statePromise);

                                }, function(){
                                    statePromise.setPrivate = false;
                                    promise.resolve(statePromise);
                                });

                            },
                            function(){
                                statePromise.setCurrent = false;

                                NotebookCommunication.setPrivate(notebookID).then(function(){
                                    statePromise.setPrivate = true;
                                    promise.resolve(statePromise);

                                }, function(){
                                    statePromise.setPrivate = false;
                                    promise.resolve(statePromise);
                                });

                            });
                    }



           }, function(){
                // reject in case of notebook creation fail
                promise.reject("created failed");
            });

            return promise.promise;

       };

        var notebookToEdit = null;

        notebookComposer.editNotebook = function(id, name){

            var promise = $q.defer();

            NotebookCommunication.setName(id, name).then(function(){
                console.log("YO");
                promise.resolve();
            }, function(){
                promise.reject("edited failed");
            });

            return promise.promise;
        };

        notebookComposer.getNotebookToEdit = function(){
            return notebookToEdit;
        };

        notebookComposer.setNotebookToEdit = function(notebook){
            console.log(notebook);
            notebookToEdit = notebook;
        };

        return notebookComposer;

    });