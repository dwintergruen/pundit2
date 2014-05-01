angular.module('Pundit2.Communication')
    .service('NotebookStore', function(BaseComponent, NameSpace, MyPundit, Analytics, $http, $q) {

        // TODO: inherit from a Store()? Annotations, items, ...
        var notebookStore = new BaseComponent("NotebookStore");

        var notebooks = [],
            myNotebooks = [];

        // TODO: after login
        notebookStore.getMyNotebooks = function() {
            var promise = $q.defer();
            notebookStore.log('Getting my notebooks from the server');

            MyPundit.login().then(function(val) {

                if (val === false) {
                    // resolve bad
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

                    if ('NotebookIDs' in data) {
                        promise.resolve(data.NotebookIDs);
                        notebookStore.log("Retrieved list of my notebooks");
                        Analytics.track('api', 'get', 'notebook owned');
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


        notebookStore.log('Component up and running');

        return notebookStore;
    });