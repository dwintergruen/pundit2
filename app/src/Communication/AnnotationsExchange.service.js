angular.module('Pundit2.Communication')
    .service('AnnotationsExchange', function(BaseComponent, NameSpace, Annotation, MyPundit, Analytics, $http, $q) {

        // TODO: inherit from a Store()? Annotations, items, ...
        var annotationExchange = new BaseComponent("AnnotationsExchange");

        annotationExchange.searchByUri = function(uris) {

            if (!angular.isArray(uris)) {
                uris = [uris];
            }

            annotationExchange.log('Searching for annotations with '+uris.length+' URIs from the server');

            var promise = $q.defer(),
                httpPromise;

            httpPromise = $http({
                headers: { 'Accept': 'application/json' },
                method: 'GET',
                url: NameSpace.get('asOpenAnnMetaSearch'),
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

                var annPromises = [];
                for (var i=0; i<ids.length; i++) {
                    var a = new Annotation(ids[i]);
                    a.then(function(aaa) {
                        annotationExchange.log('Got an annotation', aaa);
                    });
                    annPromises.push(a);
                }
                $q.all(annPromises).then(function(ret) {
                    annotationExchange.log("Retrieved annotations details searching by URIs");
                    promise.resolve(ids);

                });

                annotationExchange.log("Retrieved annotations IDs searching by URIs");

            }).error(function(data, statusCode) {
                promise.reject("Error from server while retrieving list of my notebooks: "+ statusCode);
                annotationExchange.err("Error from server while retrieving list of my notebooks: "+ statusCode);
                Analytics.track('api', 'error', 'get notebook owned', statusCode);
            });

            return promise.promise;
        };



        annotationExchange.log('Component up and running');

        return annotationExchange;
    });