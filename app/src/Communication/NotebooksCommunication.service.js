angular.module('Pundit2.Communication')
    .service('NotebookCommunication', function(BaseComponent, NameSpace, Notebook, MyPundit, Analytics, Config,
                                            $http, $q, NotebookExchange, EventDispatcher) {

        // This serive contain the http support to read and write
        // notebooks from server

        var notebookCommunication = new BaseComponent("NotebookCommunication");

        var setLoading = function (state) {
            EventDispatcher.sendEvent('Pundit.loading', state);
        };

        // TODO use a finally instead of a $q.all
        notebookCommunication.getMyNotebooks = function() {
            var promise = $q.defer();
            notebookCommunication.log('Getting my notebooks from the server');

            if(MyPundit.isUserLogged()){

                setLoading(true);

                $http({
                    headers: { 'Accept': 'application/json' },
                    method: 'GET',
                    url: NameSpace.get('asNBOwned'),
                    withCredentials: true

                }).success(function(data) {
                    setLoading(false);
                    Analytics.track('api', 'get', 'notebook owned');

                    // data is empty when user is logged in in Pundit for first time and have no notebooks (TODO: find a better way to manage the first login)
                    if (typeof(data) === 'undefined' || data === '') {
                        promise.reject('some sort of error?');
                        notebookCommunication.log("Error retrieving list of my notebooks - Server undefined response");
                        return;
                    }

                    if ('NotebookIDs' in data) {

                        var nbs = [];
                        for (var l=data.NotebookIDs.length; l--;) {
                            nbs[l] = new Notebook(data.NotebookIDs[l], true);
                        }

                        $q.all(nbs).then(function(notebooks) {
                            promise.resolve(notebooks);
                            notebookCommunication.log("Retrieved all of my notebooks");
                        }, function() {
                            promise.reject('some other error?');
                        });

                    } else {
                        promise.reject('some sort of error?');
                        notebookCommunication.log("Error retrieving list of my notebooks -- TODO");
                        // TODO: need to login (WTF?)? error? What.
                    }

                }).error(function(data, statusCode) {
                    setLoading(false);
                    promise.reject("Error from server while retrieving list of my notebooks: "+ statusCode);
                    notebookCommunication.err("Error from server while retrieving list of my notebooks: "+ statusCode);
                    Analytics.track('api', 'error', 'get notebook owned', statusCode);
                });
            } else {
                notebookCommunication.log('Impossible to get my notebooks: you have to be logged in');
                promise.reject('User not logged in');
            }

            return promise.promise;
        };

        notebookCommunication.getCurrent = function() {

            var promise = $q.defer();
            notebookCommunication.log('Getting current notebook');
            
            if(MyPundit.isUserLogged()){
                setLoading(true);

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET',
                    url: NameSpace.get('asNBCurrent'),
                    withCredentials: true
                }).success(function(data) {
                    setLoading(false);
                    notebookCommunication.log(data.NotebookID+' is the current notebook');
                    // check if exist inside notebookExchange otherwise download it and add to notebooksExchange
                    if (typeof(NotebookExchange.getNotebookById(data.NotebookID)) === 'undefined') {
                        new Notebook(data.NotebookID, true);
                    }
                    NotebookExchange.setCurrentNotebooks(data.NotebookID);
                    promise.resolve(data.NotebookID);
                }).error(function(msg) {
                    setLoading(false);
                    notebookCommunication.log('Impossible to get the current notebook ');
                    promise.reject(msg);
                });
            } else {
                notebookCommunication.log('Impossible to get current: you have to be logged in');
                promise.reject('User not logged in');
            }

            return promise.promise;
        };

        notebookCommunication.setCurrent = function(id) {
            var promise = $q.defer();
            notebookCommunication.log('Setting as current '+id);

            if(MyPundit.isUserLogged()){
                setLoading(true);

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    url: NameSpace.get('asNBCurrent')+"/"+id,
                    withCredentials: true
                }).success(function() {
                    setLoading(false);
                    notebookCommunication.log(id+' is now current');
                    NotebookExchange.setCurrentNotebooks(id);
                    promise.resolve();
                }).error(function(msg) {
                    setLoading(false);
                    notebookCommunication.log('Impossible to set as current: '+id);
                    promise.reject(msg);
                });

            } else {
                notebookCommunication.log('Impossible to set as current: you have to be logged in');
                promise.reject('User not logged in');
            }



            return promise.promise;
        };

        notebookCommunication.setPublic = function(id) {
            var promise = $q.defer();
            notebookCommunication.log('Setting as public '+id);


            if(MyPundit.isUserLogged()){
                setLoading(true);

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    url: NameSpace.get('asNBPublic', { id: id }),
                    withCredentials: true
                }).success(function() {
                    setLoading(false);
                    notebookCommunication.log(id+' is now public');
                    NotebookExchange.getNotebookById(id).setPublic();
                    promise.resolve();
                }).error(function(msg) {
                    setLoading(false);
                    notebookCommunication.log('Impossible to set as public: '+id);
                    promise.reject(msg);
                });
            } else {
                notebookCommunication.log('Impossible to set as current: you have to be logged in');
                promise.reject('User not logged in');
            }

            return promise.promise;
        };

        notebookCommunication.setPrivate = function(id) {
            var promise = $q.defer();
            notebookCommunication.log('Setting as private '+id);

            if(MyPundit.isUserLogged()){
                setLoading(true);

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    url: NameSpace.get('asNBPrivate', { id: id }),
                    withCredentials: true
                }).success(function() {
                    setLoading(false);
                    notebookCommunication.log(id+' is now private');
                    NotebookExchange.getNotebookById(id).setPrivate();
                    promise.resolve();
                }).error(function(msg) {
                    setLoading(false);
                    notebookCommunication.log('Impossible to set as private: '+id);
                    promise.reject(msg);
                });

            } else {
                notebookCommunication.log('Impossible to set as current: you have to be logged in');
                promise.reject('User not logged in');
            }


            return promise.promise;
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
                setLoading(true);
                
                $http({
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
                    setLoading(false);

                    if ('NotebookID' in data) {
                        // read metadata from server then add to notebooksExchange
                        new Notebook(data.NotebookID, true).then(function(){
                            promise.resolve(data.NotebookID);
                            notebookCommunication.log("Created a new notebook: "+data.NotebookID);
                            Analytics.track('api', 'post', 'notebook create');
                        });

                    } else {
                        promise.reject('some sort of error?');
                        notebookCommunication.log("Error creating a notebook -- TODO");
                        // TODO: need to login (WTF?)? error? What.
                    }

                }).error(function(data, statusCode) {
                    setLoading(false);
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

            if(MyPundit.isUserLogged()){
                setLoading(true);

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'DELETE',
                    url: NameSpace.get('asNB')+"/"+id,
                    withCredentials: true
                }).success(function() {
                    setLoading(false);
                    notebookCommunication.log(id+' is removed');
                    NotebookExchange.removeNotebook(id);
                    promise.resolve();
                }).error(function(msg) {
                    setLoading(false);
                    notebookCommunication.log('Impossible to remove '+id);
                    promise.reject(msg);
                });

            } else {
                notebookCommunication.log('Impossible to set as current: you have to be logged in');
                promise.reject('User not logged in');
            }

            return promise.promise;
        };

        notebookCommunication.setName = function(id, name) {
            var promise = $q.defer();
            notebookCommunication.log('Edit name of notebook '+id);

            if(MyPundit.isUserLogged()){
                setLoading(true);

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    url: NameSpace.get('asNBEditMeta', { id: id }),
                    withCredentials: true,
                    data: {
                        NotebookName: name
                    }
                }).success(function() {
                    setLoading(false);
                    notebookCommunication.log(id+' is now edited');
                    NotebookExchange.getNotebookById(id).setLabel(name);
                    promise.resolve();
                }).error(function(msg) {
                    setLoading(false);
                    notebookCommunication.log('Impossible to edit name of notebook: '+id);
                    promise.reject(msg);
                });
            } else {
                notebookCommunication.log('Impossible to set as current: you have to be logged in');
                promise.reject('User not logged in');
            }

            return promise.promise;
        };


        return notebookCommunication;
});