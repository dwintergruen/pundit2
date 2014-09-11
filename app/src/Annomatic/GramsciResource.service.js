angular.module('Pundit2.Annomatic')
.service('GramsciResource', function($resource) {

    var baseURL = "http://metasound.dibet.univpm.it:8080/DOMAnnotationService/api/annotator/v1/gramsci-dictionary";

    return $resource(baseURL, {}, {
        getAnnotations: {
            // params: {},
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }
    });

});