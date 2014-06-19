angular.module('Pundit2.NotebookComposer')
.service('NotebookComposer', function(BaseComponent, NotebookExchange, $q) {

        var notebookComposer = new BaseComponent("NotebookComposer");

        notebookComposer.createNotebook = function(notebook){
            var promise = $q.defer();
            var statePromise = {};

            // create the notebook
            NotebookExchange.createNotebook(notebook.name).then(
                function(notebookID){

                    statePromise.notebookID = notebookID;
                    // notebook public and not current
                    if(!notebook.current && notebook.visibility === 'public'){
                        promise.resolve(statePromise);

                    // notebook private and not current
                    } else if(!notebook.current && notebook.visibility === 'private'){
                        NotebookExchange.setPrivate(notebookID).then(function(){
                            statePromise.setPrivate = true;
                            promise.resolve(statePromise);

                        }, function(){
                            statePromise.setPrivate = false;
                            promise.resolve(statePromise);
                        });

                    // notebook public and current
                    } else if(notebook.current && notebook.visibility !== 'private'){
                        NotebookExchange.setCurrent(notebookID).then(
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
                        NotebookExchange.setCurrent(notebookID).then(
                            function(){
                                statePromise.setCurrent = true;

                                NotebookExchange.setPrivate(notebookID).then(function(){
                                    statePromise.setPrivate = true;
                                    promise.resolve(statePromise);

                                }, function(){
                                    statePromise.setPrivate = false;
                                    promise.resolve(statePromise);
                                });

                            },
                            function(){
                                statePromise.setCurrent = false;

                                NotebookExchange.setPrivate(notebookID).then(function(){
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

        return notebookComposer;

    });