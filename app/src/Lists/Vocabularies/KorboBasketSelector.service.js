angular.module('Pundit2.Vocabularies')
.constant('KORBOBASKETSELECTORDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#KorboBasketSelector
     *
     * @description
     * `object`
     *
     * Configuration object for KorboBasketSelector module. This factory can be instantiate
     * more times and query items from korbo.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#KorboBasketSelector.korboBasketReconURL
     *
     * @description
     * `string`
     *
     * Korbo search url, used in the first http call to get item list.
     *
     * Default value:
     * <pre> korboBasketReconURL: 'http://manager.korbo.org/api.php/basket/reconcile/' </pre>
     */
    korboBasketReconURL: 'http://manager.korbo.org/api.php/basket/reconcile/',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#KorboBasketSelector.korboBasketMetadataURL
     *
     * @description
     * `string`
     *
     * Korbo metadata url, used in the details http calls to get item details info.
     *
     * Default value:
     * <pre> freebaseTopicURL: 'https://www.googleapis.com/freebase/v1/topic' </pre>
     */
    korboBasketMetadataURL: 'http://manager.korbo.org/',

    // TODO not used, remove?
    korboItemsBaseURL: 'http://purl.org/net7/korbo',
    korboSchemaBaseURL: 'http://purl.org/net7/korbo/type/',
    
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#KorboBasketSelector.baskets
     *
     * @description
     * `Array of number`
     *
     * Number of korbo basket in which to search items, used in all http call.
     *
     * Default value:
     * <pre> baskets: [16] </pre>
     */
    baskets: [16],

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#KorboBasketSelector.active
     *
     * @description
     * `boolean`
     *
     * Enable or disable all korbo selectors instances. Only active vocabularies are added to selectorsManager
     * and can query the relative database (setting active to false vocabulary is also removed from the interface).
     *
     * Default value:
     * <pre> active: true </pre>
     */
    active: true,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#KorboBasketSelector.limit
     *
     * @description
     * `number`
     *
     * Maximum number of items taken from the vocabulary inside search http call.
     *
     * Default value:
     * <pre> limit: 15 </pre>
     */
    limit: 15,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#KorboBasketSelector.instances
     *
     * @description
     * `Array of object`
     *
     * Array of korbo instances, each object in the array allows you to add and configure 
     * an instance of the vocabulary. By default, the vocabulary has only one instance.
     * Each instance has its own tab in the interface, with its list of items.
     * 
     *
     * Default value:
     * <pre> instances: [
     *   {
     *       // where items is stored inside itemsExchange service
     *       container: 'korboBasket',
     *       // instance label tab title
     *       label: 'KorboBasket',
     *       // enable or disable the instance
     *       active: true
     *   }
     * ] </pre>
     */
    instances: [
        {
            // where items is stored inside itemsExchange service
            container: 'korboBasket',
            // instance label tab title
            label: 'KorboBasket',
            // enable or disable the instance
            active: true
        }
    ],    

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#KorboBasketSelector.debug
     *
     * @description
     * `number`
     *
     * Active debug log for this module
     *
     * Default value:
     * <pre> debug: false </pre>
     */
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