angular.module('KorboEE')
    .service('KorboCommunicationService', function($q, $http, BaseComponent, ItemsExchange, Item){

        var korboCommunication = new BaseComponent("KorboCommunication");

        var isAutocompleteLoading = false;

        korboCommunication.setAutocompleteLoading = function(val){
            isAutocompleteLoading = val;
        };

        korboCommunication.isAutocompleteLoading = function(){
            return isAutocompleteLoading;
        };


        korboCommunication.autocompleteSearch = function(val, endpoint, prov, limit, offset, lang) {
            isAutocompleteLoading = true;
            return $http({
                //headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                url: endpoint + "/search/items",
                cache: false,
                params: {
                    q: val,
                    p: prov,
                    limit: limit,
                    offset: offset,
                    lang: lang
                }
            }).then(function(res) {
                if(res.data.metadata.totalCount === "0"){
                    var noFound = [{label:"no found", noResult:true}];
                    isAutocompleteLoading = false;
                    return noFound;
                } else {
                    // wipe container
                    ItemsExchange.wipeContainer("kee-"+prov);

                    // for each results, create an item...
                    for(var i=0; i<res.data.data.length; i++){

                        var item = {
                            uri: res.data.data[i].uri,
                            label: res.data.data[i].label,
                            description: res.data.data[i].abstract,
                            depiction: res.data.data[i].depiction,
                            type: []
                        }

                        for(var j=0; j<res.data.data[i].type.length; j++){
                            item.type.push(res.data.data[i].type[j]);
                        }
                        var itemToAdd = new Item(item.uri, item);

                        //... and add to container
                        ItemsExchange.addItemToContainer(itemToAdd, "kee-"+prov);
                    }
                    isAutocompleteLoading = false;
                    return res.data.data;
                }

            },
            function(){
                isAutocompleteLoading = false;
                var errorServer = [{label:"error", errorServer:true}];
                return errorServer;
            });


        };

        return korboCommunication;
    })

.factory('KorboCommunicationFactory', function($q, $http, Item, ItemsExchange){
        // selector instance constructor
        var KorboCommFactory = function(){

        };

        // this method accept the following parameters
        // param = {
        //   endpoint
        //   label
        //   provider
        //   offset
        //   limit
        //   language
        // }
        //
        // container: where add items
        //
        KorboCommFactory.prototype.search = function(param, container){
            var promise = $q.defer();

            $http({
                //headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                url: param.endpoint + "/search/items",
                cache: false,
                params: {
                    q: param.label,
                    p: param.provider,
                    limit: param.limit,
                    offset: param.offset,
                    lang: param.lang
                }
            }).success(function(res){
                ItemsExchange.wipeContainer(container);
                for(var i=0; i<res.data.length; i++){

                    var item = {
                            uri: res.data[i].uri,
                            label: res.data[i].label,
                            description: res.data[i].abstract,
                            depiction: res.data[i].depiction,
                            type: []
                            }

                    for(var j=0; j<res.data[i].type.length; j++){
                        item.type.push(res.data[i].type[j]);
                    }
                    var itemToAdd = new Item(item.uri, item);
                    ItemsExchange.addItemToContainer(itemToAdd, container);
                }

                promise.resolve();
            }).error(function(){
                promise.reject();
            });

            return promise.promise;
        };

        return KorboCommFactory;
    });