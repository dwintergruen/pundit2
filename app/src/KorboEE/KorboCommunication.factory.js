/*jshint camelcase: false*/

angular.module('KorboEE')
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
                lang: param.language,
                basketId: param.basketID
            }

        }).success(function(res){
            // wipe container
            ItemsExchange.wipeContainer(container);
            // for each results...
            for(var i=0; i<res.data.length; i++){
                var item = {
                        uri: res.data[i].id,
                        label: res.data[i].label,
                        description: "",
                        depiction: "",
                        type: ['']
                        };
                // ... create an item...
                var itemToAdd = new Item(item.uri, item);
                // ... and add it to container
                ItemsExchange.addItemToContainer(itemToAdd, container);
            }

            promise.resolve();
        }).error(function(){
            promise.reject();
        });

        return promise.promise;
    };

    // this method accept the following parameters
    // param = {
    //   endpoint
    //   item
    //   provider
    //   basketID
    //   language
    // }
    //

    KorboCommFactory.prototype.getItem = function(param, useCache){
        var promise = $q.defer();
        var currentLanguage = angular.copy(param.language);
        $http({
            headers: { 'Accept-Language': param.language },
            method: 'GET',
            url: param.endpoint + "/baskets/"+param.basketID+"/items/"+param.item.uri+"",
            cache: useCache,
            params: {
                p: param.provider
            }
        }).success(function(res){
            res.reqLanguage = currentLanguage;
            promise.resolve(res);
        }).error(function(){
            promise.reject();
        });

        return promise.promise;
    };

    // save an entity
    KorboCommFactory.prototype.save = function(entity, lan, baseURL, basketID){
        var promise = $q.defer();

        $http({
            headers: {'Access-Control-Expose-Headers': "Location", 'Content-Language': lan},
            method: 'POST',
            url: baseURL + "/baskets/" + basketID + "/items",
            data: entity
        }).success(function(data, status, headers){
            var location = headers('Location');

            promise.resolve(location);
        }).error(function(){
            promise.reject();
        });

        return promise.promise;
    };

    return KorboCommFactory;
});