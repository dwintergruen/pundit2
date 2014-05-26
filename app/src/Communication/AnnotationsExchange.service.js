angular.module('Pundit2.Communication')
    .service('AnnotationsExchange', function(BaseComponent, NameSpace, MyPundit, Analytics, $http, $q) {

        // TODO: inherit from a Store()? Annotations, items, ...
        var annotationExchange = new BaseComponent("AnnotationsExchange");

        var annList = [],
            annListById = {};

        annotationExchange.wipe = function() {
            annotationExchange.log('Wiping every loaded annotation.');
            annList = [];
            annListById = {};
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
                });
            }
        };

        annotationExchange.getAnnotations = function() {
            return annList;
        };

        annotationExchange.getAnnotationsHash = function() {
            return annListById;
        };

        annotationExchange.log('Component up and running');
        return annotationExchange;
    });