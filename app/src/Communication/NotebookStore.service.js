angular.module('Pundit2.Communication')
    .service('NotebookStore', function(BaseComponent, NameSpace, Notebook, MyPundit, Analytics, $http, $q) {

        // TODO: inherit from a Store()? Annotations, items, ...
        var notebookStore = new BaseComponent("NotebookStore");

        notebookStore.getMyNotebooks = function() {
            var promise = $q.defer();
            notebookStore.log('Getting my notebooks from the server');

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
                    url: NameSpace.get('NBOwned'),
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
                            notebookStore.log("Retrieved all of my notebooks");
                        }, function() {
                            console.log('My notebooks all error?! :(');
                            promise.reject('some other error?');
                        });

                    } else {
                        promise.reject('some sort of error?');
                        notebookStore.log("Error retrieving list of my notebooks -- TODO");
                        // TODO: need to login (WTF?)? error? What.
                    }

                }).error(function(data, statusCode) {
                    promise.reject("Error from server while retrieving list of my notebooks: "+ statusCode);
                    notebookStore.err("Error from server while retrieving list of my notebooks: "+ statusCode);
                    Analytics.track('api', 'error', 'get notebook owned', statusCode);
                });
            });

            return promise.promise;
        };


        notebookStore.createNotebook = function(name) {
            var promise = $q.defer();
            notebookStore.log('Creating a new notebook');

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
                    url: NameSpace.get('NB'),
                    withCredentials: true,
                    data: {
                        NotebookName: name
                    }
                }).success(function(data) {

                    if ('NotebookID' in data) {
                        promise.resolve(data.NotebookID);
                        notebookStore.log("Created a new notebook: "+data.NotebookID);
                        Analytics.track('api', 'post', 'notebook create');
                    } else {
                        promise.reject('some sort of error?');
                        notebookStore.log("Error creating a notebook -- TODO");
                        // TODO: need to login (WTF?)? error? What.
                    }

                }).error(function(data, statusCode) {
                    promise.reject("Error from server while retrieving list of my notebooks: "+ statusCode);
                    notebookStore.err("Error from server while retrieving list of my notebooks: "+ statusCode);
                    Analytics.track('api', 'error', 'get notebook owned', statusCode);
                });
            });

            return promise.promise;
        };



        notebookStore.log('Component up and running');

        return notebookStore;
    });