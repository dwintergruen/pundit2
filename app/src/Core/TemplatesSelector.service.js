angular.module('Pundit2.Core')
.service('TemplatesSelector', function(BaseComponent, Config, $http, $q,
    TemplatesExchange, FreebaseSelector) {
    
    var templateSelector = new BaseComponent("TemplatesSelector");

    var selector = new FreebaseSelector({
        container: 'freebase'
    });

    var testUrls = [
        "http://conf.thepund.it/V2/templates/tagFree",
        "http://conf.thepund.it/V2/templates/comment",
        "http://conf.thepund.it/V2/templates/tagFixedMarx",
        "http://conf.thepund.it/V2/templates/timeline",
        "http://conf.thepund.it/V2/templates/peopleGraph"
    ];

    // get all templates from urls passed with pundit configuration object
    // inside templates array
    templateSelector.getAll = function() {
        var urls = /*Config.templates,*/ testUrls,
            promiseArr = [];

        for (var i in urls) {
            promiseArr.push(templateSelector.get(urls[i]));
        }
            
        templateSelector.log("Loading predicates from", urls);
        
        return $q.all(promiseArr);
    };

    // make a jsonp to get template object from url
    templateSelector.get = function(url){

        // promise il always resolved to use $q.all
        // if the result value is undefined
        // there was an error
        var promise = $q.defer();

        $http.jsonp(url+"?jsonp=JSON_CALLBACK")
            .success(function(data){

                if (typeof(data) === 'undefined' || typeof(data.triples) === 'undefined') {
                    templateSelector.log("Impossible to get templates from: "+url);
                    promise.resolve(undefined);
                    return;
                }

                // url is used as id to identify the template
                data.id = url;

                // chek if need to get items from freebase
                var trp = data.triples;
                for(var i in trp) {
                    // if the type is an uri we must get items from uri
                    if (typeof(trp[i].object) !== 'undefined' && trp[i].object.type === 'uri') {
                        // identify how selector use by parsing the uri
                        // now we support only freebase
                        if (trp[i].object.value.indexOf('freebase') > -1) {
                            var mid = trp[i].object.value.substring(23);
                            // make an incomplete item
                            // which will be completed by the selector
                            var item = {
                                mid: mid,
                                image: 'https://usercontent.googleapis.com/freebase/v1/image' + mid,
                                description: -1,
                                uri: -1
                            };
                            var p = $q.defer();
                            p.promise.then(function(ret){
                                // when promise is resolved the item
                                // is compleated, override uri with complete item values
                                trp[i].object.type = 'item';
                                trp[i].object.value = ret;
                                // TODO how label use?
                                trp[i].object.value.label = trp[i].object.value.description;
                            });
                            selector.getItemDetails(item, p);
                        }
                    }
                }

                // TODO at this point we have the template info
                // but is possible that we not have the items info
                // if we have get it eg. from freebase
                TemplatesExchange.addTemplate(data);
                promise.resolve(data);

            })
            .error(function(){
                promise.resolve(undefined);
            });

        return promise.promise;

    };

    return templateSelector;

});