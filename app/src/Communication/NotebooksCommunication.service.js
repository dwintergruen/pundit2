angular.module('Pundit2.Communication')
    .service('NotebookCommunication', function(BaseComponent, NameSpace, Notebook, MyPundit, Analytics, Config,
                                            $http, $q, NotebookExchange) {

        // This serive contain the http support to read and write
        // notebooks from server

        var notebookCommunication = new BaseComponent("NotebookCommunication");


        notebookCommunication.getMyNotebooks = function() {
            var promise = $q.defer();
            notebookCommunication.log('Getting my notebooks from the server');

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
                            nbs[l] = new Notebook(data.NotebookIDs[l], true);
                        }

                        $q.all(nbs).then(function(notebooks) {
                            promise.resolve(notebooks);
                            notebookCommunication.log("Retrieved all of my notebooks");
                        }, function() {
                            console.log('My notebooks all error?! :(');
                            promise.reject('some other error?');
                        });

                    } else {
                        promise.reject('some sort of error?');
                        notebookCommunication.log("Error retrieving list of my notebooks -- TODO");
                        // TODO: need to login (WTF?)? error? What.
                    }

                }).error(function(data, statusCode) {
                    promise.reject("Error from server while retrieving list of my notebooks: "+ statusCode);
                    notebookCommunication.err("Error from server while retrieving list of my notebooks: "+ statusCode);
                    Analytics.track('api', 'error', 'get notebook owned', statusCode);
                });
            });

            return promise.promise;
        };

        notebookCommunication.getCurrent = function() {

            var promise = $q.defer();
            notebookCommunication.log('Getting current notebook');
            MyPundit.login().then(function(val) {

                if (val === false) {
                    promise.reject('Ouch! Login error');
                } else {

                    $http({
                        headers: { 'Content-Type': 'application/json' },
                        method: 'GET',
                        url: NameSpace.get('asNBCurrent'),
                        withCredentials: true
                    }).success(function(id) {
                        notebookCommunication.log(id+' is the current notebook');
                        promise.resolve(id);
                    }).error(function(msg) {
                        notebookCommunication.log('Impossible to get the current notebook ');
                        promise.reject(msg);
                    });
                }

            });

            return promise.promise;
        };

        notebookCommunication.setCurrent = function(id) {
            var promise = $q.defer();
            notebookCommunication.log('Setting as current '+id);

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
                        notebookCommunication.log(id+' is now current');
                        NotebookExchange.setCurrentNotebooks(id);
                        promise.resolve();
                    }).error(function(msg) {
                        notebookCommunication.log('Impossible to set as current: '+id);
                        promise.reject(msg);
                    });
                }

            });

            return promise.promise;
        };

        notebookCommunication.setPublic = function(id) {
            var promise = $q.defer();
            notebookCommunication.log('Setting as public '+id);

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
                    notebookCommunication.log(id+' is now public');
                    NotebookExchange.getNotebookById(id).setPublic();
                    promise.resolve();
                }).error(function(msg) {
                    notebookCommunication.log('Impossible to set as public: '+id);
                    promise.reject(msg);
                });

            });

            return promise.promise;
        };

        notebookCommunication.setPrivate = function(id) {
            var promise = $q.defer();
            notebookCommunication.log('Setting as private '+id);

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
                    notebookCommunication.log(id+' is now private');
                    NotebookExchange.getNotebookById(id).setPrivate();
                    promise.resolve();
                }).error(function(msg) {
                    notebookCommunication.log('Impossible to set as private: '+id);
                    promise.reject(msg);
                });

            });

            return promise.promise;
        };

        notebookCommunication.setActive = function() {
            // TODO
        };

        notebookCommunication.createNotebook = function(name) {
            var promise = $q.defer();
            notebookCommunication.log('Creating a new notebook');

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
                        // read metadata from server then add to notebooksExchange
                        new Notebook(data.NotebookID, true);                        
                        promise.resolve(data.NotebookID);
                        notebookCommunication.log("Created a new notebook: "+data.NotebookID);
                        Analytics.track('api', 'post', 'notebook create');
                    } else {
                        promise.reject('some sort of error?');
                        notebookCommunication.log("Error creating a notebook -- TODO");
                        // TODO: need to login (WTF?)? error? What.
                    }

                }).error(function(data, statusCode) {
                    promise.reject("Error from server while retrieving list of my notebooks: "+ statusCode);
                    notebookCommunication.err("Error from server while retrieving list of my notebooks: "+ statusCode);
                    Analytics.track('api', 'error', 'get notebook owned', statusCode);
                });
            });

            return promise.promise;
        };

        notebookCommunication.deleteNotebook = function(id) {
            var promise = $q.defer();
            notebookCommunication.log('Deleting '+id);

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
                    notebookCommunication.log(id+' is removed');
                    NotebookExchange.removeNotebook(id);
                    promise.resolve();
                }).error(function(msg) {
                    notebookCommunication.log('Impossible to remove '+id);
                    promise.reject(msg);
                });

            });

            return promise.promise;
        };


        return notebookCommunication;
});