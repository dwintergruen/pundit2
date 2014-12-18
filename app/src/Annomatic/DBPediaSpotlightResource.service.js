angular.module('Pundit2.Annomatic')

.service('DBPediaSpotlightResource', function($http, $q) {

    /* Just an example of how to retrieve annotations from DBPedia spotlight annotate service.
     * DataTXT is waaay better and returns the same entities anyway ... stick to it :P
     **/

    var service,
        promise = $q.defer(),
        baseURL = "http://spotlight.dbpedia.org/rest/annotate";

    service = {
        getAnnotations: function(text) {

            $http({
                data: "text=" + encodeURIComponent(text),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                method: 'POST',
                url: baseURL
            }).success(function(data) {
                promise.resolve(data);
            });

            return promise.promise;
        }
    };

    return service;

});