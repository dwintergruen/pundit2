angular.module('Pundit2.Vocabularies')
.constant('KORBOBASKETSELECTORDEFAULTS', {

    // common configuration
    korboBasketReconURL: 'http://manager.korbo.org/api.php/basket/reconcile/',
    korboBasketMetadataURL: 'http://manager.korbo.org/',
    korboItemsBaseURL: 'http://purl.org/net7/korbo',
    korboSchemaBaseURL: 'http://purl.org/net7/korbo/type/',
    
    baskets: [16],

    // enable or disable all muruca selectors instances
    active: true,
    // max number of items
    limit: 15,

    // singles instances configuration
    instances: [
        {
            // where put items inside items exchange
            container: 'korboBasket',
            // used how tab title
            label: 'KorboBasket',
            // true if this instace do the query
            active: true
        }
    ],    

    debug: false

})
.factory('KorboBasketSelector', function(BaseComponent, KORBOBASKETSELECTORDEFAULTS, Item, ItemsExchange, SelectorsManager,
                                            $http, $q) {

    var korboBasketSelector = new BaseComponent('KorboBasketSelector', KORBOBASKETSELECTORDEFAULTS);
    korboBasketSelector.name = 'KorboBasketSelector';

    // add this selector to selector manager
    // then the configured instances are read an instantiated
    if (korboBasketSelector.options.active) {
        SelectorsManager.addSelector(korboBasketSelector);
    }

    // selector instance constructor
    var KorboBasketFactory = function(config){
        this.config = config;
    };

    KorboBasketFactory.prototype.getItems = function(term){
        var self = this,
            promise = $q.defer();

        var config = {
            params: {
                query: {
                    query: term,
                    limit: korboBasketSelector.options.limit
                }
            },
            withCredentials: true
        };

        $http.jsonp(korboBasketSelector.options.korboBasketReconURL+korboBasketSelector.options.baskets[0]+"?jsonp=JSON_CALLBACK", config)
            .success(function(data){

                korboBasketSelector.log('Http success, get items '+self.config.label, data);

                if (data.result.length === 0) {
                    korboBasketSelector.log('Http success, but empty response');
                    ItemsExchange.wipeContainer(self.config.container);
                    promise.resolve();
                    return;
                }

                var promiseArr = [];
                var deferArr = [];
                var itemsArr = [];
                for (var i=0; i<data.result.length; i++) {
                    var current = data.result[i];

                    var item = {
                        label: current.name, 
                        uri: current.resource_url,
                        type: []
                    };
                    itemsArr.push(item);

                    var itemPromise = $q.defer();
                    promiseArr.push(itemPromise.promise);
                    deferArr.push(itemPromise);

                }

                $q.all(promiseArr).then(function(){
                    korboBasketSelector.log('Completed all items http request');
                    // when all http request are completed we can wipe itemsExchange
                    // and put new items inside relative container
                    ItemsExchange.wipeContainer(self.config.container);
                    for (i=0; i<itemsArr.length; i++) {
                        ItemsExchange.addItemToContainer(new Item(itemsArr[i].uri, itemsArr[i]), self.config.container);
                    }
                    promise.resolve();
                });

                for (i=0; i<data.result.length; i++) {
                    self.getItemDetails(itemsArr[i], deferArr[i]);
                }

            });

        return promise.promise;

    };

    KorboBasketFactory.prototype.getItemDetails = function(item, itemPromise){

        var self = this;

        korboBasketSelector.log('Loading metadata for item '+ item.uri);

        var config = {
            params: {
                url: item.uri
            },
            withCredentials: true
        };

        $http.jsonp(korboBasketSelector.options.korboBasketMetadataURL+korboBasketSelector.options.baskets[0]+"?jsonp=JSON_CALLBACK", config)
            .success(function(data){

                korboBasketSelector.log('Http item details success, get item', data);

                // extend existing item with details propeties
                var o = data.result;

                if ('image' in o) {
                    item.image = o.image;
                }                    

                if ('description' in o) {
                    item.description = o.description;
                }                    
                    
                if (('rdftype' in o) && ('length' in o.rdftype)) {
                    for (var j = o.rdftype.length; j--;) {
                        if (typeof(o.rdftype[j]) === 'string') {
                            item.type.push(o.rdftype[j]);
                        }
                        else {
                            korboBasketSelector.log('ERROR: Weird type is weird? '+typeof(o.rdftype[j])+': '+o.rdftype[j]);
                        }
                    }
                }

                // resolve item promise
                itemPromise.resolve();

            });

    };

    korboBasketSelector.log('Factory init');

    return KorboBasketFactory;

});