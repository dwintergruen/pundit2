angular.module('Pundit2.Communication')
    .service('NotebookExchange', function(BaseComponent, NameSpace, Notebook, MyPundit, Analytics, Config, ItemsExchange,
                                            $http, $q) {

        var notebookExchange = new BaseComponent("NotebookExchange");

        notebookExchange.getMyNotebooks = function() {
            var promise = $q.defer();
            notebookExchange.log('Getting my notebooks from the server');

            MyPundit.login().then(function(val) {

                if (val === false) {
                    // TODO: resolve badly
                    promise.reject('Ouch!');
                    return;
                }

                var httpPromise;
                httpPromise = $http({
                    headers: { 'Accept': 'application/json' },
                    method: 'GET',
                    url: NameSpace.get('asNBOwned'),
                    withCredentials: true

                }).success(function(data) {
                    Analytics.track('api', 'get', 'notebook owned');

                    if ('NotebookIDs' in data) {

                        var nbs = [];
                        for (var l=data.NotebookIDs.length; l--;) {
                            nbs[l] = new Notebook(data.NotebookIDs[l]);
                        }

                        $q.all(nbs).then(function(notebooks) {
                            promise.resolve(notebooks);
                            // add all my notebooks to my notebooks container inside items exchange
                            // notebooks are treated as item
                            for (l=0; l < notebooks.length; l++) {
                                ItemsExchange.addItem(notebooks[l], Config.modules.MyNotebooksContainer.container);
                            }
                            notebookExchange.log("Retrieved all of my notebooks");
                        }, function() {
                            console.log('My notebooks all error?! :(');
                            promise.reject('some other error?');
                        });

                    } else {
                        promise.reject('some sort of error?');
                        notebookExchange.log("Error retrieving list of my notebooks -- TODO");
                        // TODO: need to login (WTF?)? error? What.
                    }

                }).error(function(data, statusCode) {
                    promise.reject("Error from server while retrieving list of my notebooks: "+ statusCode);
                    notebookExchange.err("Error from server while retrieving list of my notebooks: "+ statusCode);
                    Analytics.track('api', 'error', 'get notebook owned', statusCode);
                });
            });

            return promise.promise;
        };


        notebookExchange.getCurrent = function() {
            // TODO
        };

        notebookExchange.setCurrent = function(id) {
            var promise = $q.defer();
            notebookExchange.log('Setting as current '+id);

            MyPundit.login().then(function(val) {

                if (val === false) {
                    promise.reject('Ouch! Login error');
                } else {

                    $http({
                        headers: { 'Content-Type': 'application/json' },
                        method: 'PUT',
                        url: NameSpace.get('asNBCurrent')+"/"+id,
                        withCredentials: true
                    }).success(function() {
                        notebookExchange.log(id+' is now current');
                        promise.resolve();
                    }).error(function(msg) {
                        notebookExchange.log('Impossible to set as current: '+id);
                        promise.reject(msg);
                    });
                }

            });

            return promise.promise;
        };

        notebookExchange.setPublic = function(id) {
            var promise = $q.defer();
            notebookExchange.log('Setting as public '+id);

            MyPundit.login().then(function(val) {

                if (val === false) {
                    promise.reject('Ouch! Login error');
                    return;
                }

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    url: NameSpace.get('asNBPublic', { id: id }),
                    withCredentials: true
                }).success(function() {
                    notebookExchange.log(id+' is now public');
                    promise.resolve();
                }).error(function(msg) {
                    notebookExchange.log('Impossible to set as public: '+id);
                    promise.reject(msg);
                });

            });

            return promise.promise;
        };

        notebookExchange.setPrivate = function(id) {
            var promise = $q.defer();
            notebookExchange.log('Setting as private '+id);

            MyPundit.login().then(function(val) {

                if (val === false) {
                    promise.reject('Ouch! Login error');
                    return;
                }

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    url: NameSpace.get('asNBPrivate', { id: id }),
                    withCredentials: true
                }).success(function() {
                    notebookExchange.log(id+' is now private');
                    promise.resolve();
                }).error(function(msg) {
                    notebookExchange.log('Impossible to set as private: '+id);
                    promise.reject(msg);
                });

            });

            return promise.promise;
        };

        notebookExchange.setActive = function() {
            // TODO
        };

        notebookExchange.createNotebook = function(name) {
            var promise = $q.defer();
            notebookExchange.log('Creating a new notebook');

            MyPundit.login().then(function(val) {

                if (val === false) {
                    // TODO: resolve badly
                    promise.reject('Ouch!');
                    return;
                }

                var httpPromise;
                httpPromise = $http({
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json;charset=UTF-8;"
                    },
                    method: 'POST',
                    url: NameSpace.get('asNB'),
                    withCredentials: true,
                    data: {
                        NotebookName: name
                    }
                }).success(function(data) {

                    if ('NotebookID' in data) {
                        new Notebook(data.NotebookID).then(function(notebook){
                            // TODO move this inside new Notebook
                            ItemsExchange.addItem(notebook, Config.modules.MyNotebooksContainer.container);
                        });                        
                        promise.resolve(data.NotebookID);
                        notebookExchange.log("Created a new notebook: "+data.NotebookID);
                        Analytics.track('api', 'post', 'notebook create');
                    } else {
                        promise.reject('some sort of error?');
                        notebookExchange.log("Error creating a notebook -- TODO");
                        // TODO: need to login (WTF?)? error? What.
                    }

                }).error(function(data, statusCode) {
                    promise.reject("Error from server while retrieving list of my notebooks: "+ statusCode);
                    notebookExchange.err("Error from server while retrieving list of my notebooks: "+ statusCode);
                    Analytics.track('api', 'error', 'get notebook owned', statusCode);
                });
            });

            return promise.promise;
        };

        notebookExchange.deleteNotebook = function(id) {
            var promise = $q.defer();
            notebookExchange.log('Deleting '+id);

            MyPundit.login().then(function(val) {

                if (val === false) {
                    promise.reject('Ouch! Login error');
                    return;
                }

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'DELETE',
                    url: NameSpace.get('asNB')+"/"+id,
                    withCredentials: true
                }).success(function() {
                    notebookExchange.log(id+' is removed');
                    promise.resolve();
                }).error(function(msg) {
                    notebookExchange.log('Impossible to remove '+id);
                    promise.reject(msg);
                });

            });

            return promise.promise;
        };

        notebookExchange.log('Component up and running');

        return notebookExchange;
    });