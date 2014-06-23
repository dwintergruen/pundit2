angular.module('Pundit2.Communication')
    .service('AnnotationsExchange', function(BaseComponent, NameSpace, MyPundit, Analytics, $http, $q) {

        // TODO: inherit from a Store()? Annotations, items, ...
        var annotationExchange = new BaseComponent("AnnotationsExchange");

        var annList = [],
            annListById = {},
            annListByNotebook = [];

        annotationExchange.wipe = function() {
            annotationExchange.log('Wiping every loaded annotation.');
            annList = [];
            annListById = {};
            annListByNotebook = [];
        };

        // Returns a promise which gets resolved by an array of IDS of the annotations found.
        // If the user is logged in, the authenticated API is called, otherwise
        annotationExchange.searchByUri = function(uris) {

            if (!angular.isArray(uris)) {
                uris = [uris];
            }

            annotationExchange.log('Searching for annotations with '+uris.length+' URIs from the server');

            var promise = $q.defer(),
                httpPromise,
                nsKey = (MyPundit.isUserLogged()) ? 'asAnnMetaSearch' : 'asOpenAnnMetaSearch';

            httpPromise = $http({
                headers: { 'Accept': 'application/json' },
                method: 'GET',
                url: NameSpace.get(nsKey),
                cache: false,
                params: {
                    scope: "all",
                    query: {
                        resources: uris
                    }
                },
                withCredentials: true

            }).success(function(data) {
                Analytics.track('api', 'get', 'search');

                // TODO: check for emptyness? More edge cases?

                var ids = [];
                for (var annURI in data) {
                    var id = annURI.match(/[a-z0-9]*$/);
                    if (id !== null) {
                        ids.push(id[0]);
                    }
                }

                promise.resolve(ids);
                annotationExchange.log("Retrieved annotations IDs searching by URIs");

            }).error(function(data, statusCode) {
                var err = "Error from server while searching for annotations by URIs: "+ statusCode;
                promise.reject(err);
                annotationExchange.err(err);
                Analytics.track('api', 'error', 'get '+nsKey, statusCode);
            });

            return promise.promise;
        };

        annotationExchange.addAnnotation = function(ann) {
            // TODO: sanity checks?
            if (ann.id in annListById) {
                annotationExchange.log('Not adding annotation '+ann.id+': already present.');
            } else {
                ann._q.promise.then(function(a) {
                    annListById[ann.id] = a;
                    annList.push(a);

                    if(typeof(annListByNotebook[a.isIncludedIn]) === 'undefined' || annListByNotebook[a.isIncludedIn] === null){
                        annListByNotebook[a.isIncludedIn] = [];
                    }
                    annListByNotebook[a.isIncludedIn].push(a);
                });
            }
        };

        annotationExchange.getAnnotations = function() {
            return annList;
        };

        annotationExchange.getAnnotationById = function(id) {
            if (id in annListById) {
                return annListById[id];
            }
            // If the item is not found, it will return undefined
        };

        annotationExchange.getAnnotationByNotebook = function(notebookID) {

                if(typeof(annListByNotebook[notebookID]) === 'undefined' || annListByNotebook[notebookID] === null){
                    return;
                } else {
                    return annListByNotebook[notebookID];
                }

            // If the item is not found, it will return undefined
        };

        annotationExchange.getAnnotationsHash = function() {
            return annListById;
        };

        // remove all annotation contained inside specified notebook
        annotationExchange.removeAnnotationByNotebookId = function(notebookID){
            annotationExchange.log("Removing annotation of notebook: "+notebookID);
            for (var i=0; i<annList.length; i++) {
                var ann = annList[i];
                if (ann.isIncludedIn === notebookID) {
                    annotationExchange.log("Removed annotation "+ann.uri);
                    delete annListById[ann.id];
                    annList.splice(i, 1);
                }
            }
        };

        annotationExchange.log('Component up and running');
        return annotationExchange;
    });