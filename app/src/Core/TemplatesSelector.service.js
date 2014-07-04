angular.module('Pundit2.Core')
.service('TemplatesSelector', function(BaseComponent, Config, $http, $q) {
    
    var templateSelector = new BaseComponent("TemplatesSelector");

    // get all templates from urls passed with pundit configuration object
    // inside templates array
    templateSelector.getAll = function() {
        var urls = Config.templates,
            result = [],
            promise = $q.defer();
            
        templateSelector.log("Loading predicates from", urls);
        
        return promise.promise;
    };

    // make a jsonp to get template object from url
    templateSelector.get = function(url){

        var promise = $q.defer();

        $http.jsonp(url+"?jsonp=JSON_CALLBACK")
            .success(function(data){

                console.log(data);

                if (typeof(data) === 'undefined' ) {
                    templateSelector.log("Impossible to get predicates from: "+url);
                    promise.resolve();
                    return;
                }
            });

        return promise.promise;

    };

    templateSelector.get("http://conf.thepund.it/V2/templates/tagFixedMarx");

    return templateSelector;

});