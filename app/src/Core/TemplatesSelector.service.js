angular.module('Pundit2.Core')
.service('TemplatesSelector', function(BaseComponent, Config, $http, $q,
    Item, Template, ItemsExchange, TemplatesExchange, FreebaseSelector, SelectorsManager) {
    
    var templatesSelector = new BaseComponent("TemplatesSelector");

    var selector = new FreebaseSelector({
        container: 'freebase'
    });

    // TODO generate color indipendently from template number
    // this array must have the same number of element of the Config.templates array
    var colors = ["#FF00FF", "#0000FF", "#00FFFF", "#00FF00", "#FFFF00"];

    // by convention the template initially used as current
    // is the first of the urls list

    // get all templates from urls passed with pundit configuration object
    // inside templates array
    templatesSelector.getAll = function() {
        var urls = Config.templates,
            promiseArr = [];

        // set the first as current
        TemplatesExchange.setCurrent(urls[0]);

        for (var i in urls) {
            promiseArr.push(templatesSelector.get(urls[i], colors[i]));
        }
            
        templatesSelector.log("Loading predicates from", urls);
        
        return $q.all(promiseArr);
    };

    // make a jsonp to get template object from url
    templatesSelector.get = function(url, color){

        // promise il always resolved to use $q.all
        // if the result value is undefined
        // there was an error
        var promise = $q.defer();

        $http.jsonp(url+"?jsonp=JSON_CALLBACK")
            .success(function(data){

                if (typeof(data) === 'undefined' || typeof(data.triples) === 'undefined') {
                    templatesSelector.log("Impossible to get templates from: "+url);
                    promise.resolve(undefined);
                    return;
                }

                // url is used as id to identify the template
                data.id = url;
                if (typeof(color) !== 'undefined') {
                    data.color = color;                    
                }

                var i,
                    trp = data.triples;

                for(i in trp) {
                    // read predicate and made a real item
                    if (typeof(trp[i].predicate) !== 'undefined') {
                        trp[i].predicate.type = ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"];
                        trp[i].predicate = new Item(trp[i].predicate.uri, trp[i].predicate);
                        ItemsExchange.addItemToContainer(trp[i].predicate, Config.modules.Client.relationsContainer);
                    }
                }
                
                var tmpl = new Template(data.id, data);
                for(i in trp) {
                    // if the type is an uri we must get items from uri
                    if (typeof(trp[i].object) !== 'undefined' && trp[i].object.type === 'uri') {
                        // identify how selector use by parsing the uri
                        // now we support only freebase
                        if (trp[i].object.value.indexOf('freebase') > -1) {
                            (function closure(_i) {
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
                                    tmpl.triples[_i].object.type = 'item';
                                    tmpl.triples[_i].object.value = ret;
                                    // TODO how label use?
                                    tmpl.triples[_i].object.value.label = tmpl.triples[_i].object.value.description;
                                    tmpl.triples[_i].object.value = new Item(tmpl.triples[_i].object.value.uri, tmpl.triples[_i].object.value);
                                });
                                selector.getItemDetails(item, p);
                            })(i);
                            
                        }
                    }
                }

                // TODO at this point we have the template info
                // but is possible that we not have the items info
                // if we have get it eg. from freebase
                console.log(tmpl);
                promise.resolve(tmpl);

            })
            .error(function(){
                promise.resolve(undefined);
            });

        return promise.promise;

    };

    return templatesSelector;

});