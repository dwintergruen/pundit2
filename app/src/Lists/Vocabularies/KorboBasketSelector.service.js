angular.module('Pundit2.Vocabularies')
.constant('KORBOBASKETSELECTORDEFAULTS', {

    // common configuration
    korboBasketReconURL: 'http://manager.korbo.org/api.php/basket/reconcile/',
    korboBasketMetadataURL: 'http://manager.korbo.org/',
    korboItemsBaseURL: 'http://purl.org/net7/korbo',
    korboSchemaBaseURL: 'http://purl.org/net7/korbo/type/',
    
    baskets: [16],
    //baskets: [82],

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
.factory('KorboBasketSelector', function(BaseComponent, KORBOBASKETSELECTORDEFAULTS, Item, ItemsExchange, SelectorsManager, $http) {

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

    KorboBasketFactory.prototype.getItems = function(term, callback){
        var self = this;

        ItemsExchange.wipeContainer(self.config.container);

        var config = {
            params: {
                query: angular.toJson({
                    query: term
                    //limit: korboBasketSelector.options.limit
                })
            }
        };

        $http.jsonp(korboBasketSelector.options.korboBasketReconURL+korboBasketSelector.options.baskets[0]+"?jsonp=JSON_CALLBACK", config)
            .success(function(data){

                korboBasketSelector.log('Http success, get items '+self.config.label, data);

                //self.getItemsDetails(data.result, callback);

            });

    };

    KorboBasketFactory.prototype.getItemsDetails = function(result, callback){

        var self = this;

        for (var i=0; i<result.length; i++) {
            var current = result[i];

            var item = {
                label: current.name, 
                uri: current.resource_url,
                type: []
            };

            korboBasketSelector.log('Loading metadata for item '+ item.uri);

            if ('description' in current) {
                item.description = current.description;
            }
                
            if (('type' in current) && ('length' in current.type)) {
                for (var j = current.type.length; j--;) {
                    if (typeof(current.type[j]) === 'string') {
                        // add type to item
                        item.type.push(current.type[j]);
                    }
                    else {
                        korboBasketSelector.log('ERROR: Weird type is weird? '+typeof(current.type[j])+': '+current.type[j]);
                    }
                }
            }

            var added = new Item(item.uri, item);
            ItemsExchange.addItemToContainer(added, self.config.container);

        }

        callback();

        korboBasketSelector.log('Complete items parsing');

    };

    korboBasketSelector.log('Factory init');

    return KorboBasketFactory;

});