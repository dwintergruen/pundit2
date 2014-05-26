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
    limit: 5,

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
        this.pendingRequest = 0;
    };

    KorboBasketFactory.prototype.getItems = function(term){
        var self = this,
            promise = $q.defer();

        var config = {
            params: {
                query: angular.toJson({
                    query: term,
                    limit: korboBasketSelector.options.limit
                })
            },
            withCredentials: true
        };

        $http.jsonp(korboBasketSelector.options.korboBasketReconURL+korboBasketSelector.options.baskets[0]+"?jsonp=JSON_CALLBACK", config)
            .success(function(data){

                korboBasketSelector.log('Http success, get items '+self.config.label, data);

                ItemsExchange.wipeContainer(self.config.container);

                if (data.result.length === 0) {
                    korboBasketSelector.log('Empty response');
                    promise.resolve();
                    return;
                }

                self.pendingRequest = data.result.length;

                for (var i=0; i<data.result.length; i++) {
                    var current = data.result[i];

                    var item = {
                        label: current.name, 
                        uri: current.resource_url,
                        type: []
                    };

                self.getItemDetails(item, promise);

                }

            });

            return promise.promise;

    };

    KorboBasketFactory.prototype.getItemDetails = function(item, promise){

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
                            self.log('ERROR: Weird type is weird? '+typeof(o.rdftype[j])+': '+o.rdftype[j]);
                        }
                    }
                }

                var added = new Item(item.uri, item);
                ItemsExchange.addItemToContainer(added, self.config.container);

                self.pendingRequest--;
                if (self.pendingRequest <= 0) {
                    korboBasketSelector.log('Items complete parsing');
                    promise.resolve();
                }

            });

    };

    korboBasketSelector.log('Factory init');

    return KorboBasketFactory;

});