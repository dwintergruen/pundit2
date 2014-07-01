angular.module('Pundit2.Vocabularies')
.constant('MURUCASELECTORDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MurucaSelector
     *
     * @description
     * `object`
     *
     * Configuration object for MurucaSelector module. This factory can be instantiate
     * more times and query items from Galassia Ariosto.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MurucaSelector.murucaReconURL
     *
     * @description
     * `string`
     *
     * Muruca search url, used in the http call to get item.
     *
     * Default value:
     * <pre> murucaReconURL: 'http://demo2.galassiaariosto.netseven.it/backend.php/reconcile' </pre>
     */
    murucaReconURL: 'http://demo2.galassiaariosto.netseven.it/backend.php/reconcile',
    // 'http://demo2.galassiaariosto.netseven.it/reconcile',

    // TODO doc
    queryProperties: {},
    
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MurucaSelector.active
     *
     * @description
     * `boolean`
     *
     * Enable or disable all muruca selectors instances. Only active vocabularies are added to selectorsManager
     * and can query the relative database (setting active to false vocabulary is also removed from the interface).
     *
     * Default value:
     * <pre> active: true </pre>
     */
    active: true,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MurucaSelector.limit
     *
     * @description
     * `number`
     *
     * Maximum number of items taken from the vocabulary inside search http call.
     *
     * Default value:
     * <pre> limit: 5 </pre>
     */
    limit: 5,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MurucaSelector.instances
     *
     * @description
     * `Array of object`
     *
     * Array of muruca instances, each object in the array allows you to add and configure 
     * an instance of the vocabulary. By default, the vocabulary has only one instance.
     * Each instance has its own tab in the interface, with its list of items.
     * 
     *
     * Default value:
     * <pre> instances: [
     *   {
     *       // query type (legal value are: Azione, Scena, Influenza, Ecphrasis, ecc..)
     *       queryType: 'http://purl.org/galassiariosto/types/Azione', 
     *       // where items is stored inside itemsExchange service
     *       container: 'muruca',
     *       // instance label tab title
     *       label: 'Muruca',
     *       // enable or disable the instance
     *       active: true
     *   }
     * ] </pre>
     */
    instances: [
        {
            // query type (legal value are: Azione, Scena, Influenza, Ecphrasis, ecc..)
            queryType: 'http://purl.org/galassiariosto/types/Azione', 
            // where items is stored inside itemsExchange service
            container: 'muruca',
            // instance label tab title
            label: 'Muruca',
            // enable or disable the instance
            active: true
        }
    ],    

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MurucaSelector.debug
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
.factory('MurucaSelector', function(BaseComponent, MURUCASELECTORDEFAULTS, Item, ItemsExchange, SelectorsManager,
    $http, $q, $timeout) {

    var murucaSelector = new BaseComponent('MurucaSelector', MURUCASELECTORDEFAULTS);
    murucaSelector.name = 'MurucaSelector';

    // add this selector to selector manager
    // then the configured instances are read an instantiated
    if (murucaSelector.options.active) {
        SelectorsManager.addSelector(murucaSelector);
    }

    // selector instance constructor
    var MurucaFactory = function(config){
        this.config = config;
    };

    // TODO if the server not response the http timeout is very long (120s)
    // and the error notification arrive only after this time (need a less timeout?)
    MurucaFactory.prototype.getItems = function(term){
        var self = this,
        promise = $q.defer();

        var config = {
            params: {
                query: {
                    query: term,
                    type: self.config.queryType,
                    properties: murucaSelector.options.queryProperties,
                    limit: murucaSelector.options.limit
                }
            }
        };

        $http.jsonp(murucaSelector.options.murucaReconURL+"?jsonp=JSON_CALLBACK", config)
            .success(function(data){

                murucaSelector.log('Http success, get items from muruca '+self.config.label, data);

                ItemsExchange.wipeContainer(self.config.container);

                if (data.result.length === 0) {
                    murucaSelector.log('Empty Response');
                    // promise is resolved but container is undefined
                    promise.resolve();
                } else {
                    // this function is synchronous
                    self.getItemsDetails(data.result, promise);
                }

            }).error(function () {
                ItemsExchange.wipeContainer(self.config.container);
                // promise is resolved but container is undefined
                promise.resolve();
            });

            return promise.promise;

    };

    MurucaFactory.prototype.getItemsDetails = function(result, promise){

        var self = this;

        for (var i=0; i<result.length; i++) {
            var current = result[i];

            var item = {
                label: current.name, 
                uri: current.resource_url,
                type: []
            };

            murucaSelector.log('Loading metadata for item '+ item.uri);

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
                        murucaSelector.log('ERROR: Weird type is weird? '+typeof(current.type[j])+': '+current.type[j]);
                    }
                }
            }

            var added = new Item(item.uri, item);
            ItemsExchange.addItemToContainer(added, self.config.container);

        }

        // promise is always resolved when parsing is completed
        // and the items were added to the itemsExchange
        promise.resolve();

        murucaSelector.log('Complete items parsing');

    };

    murucaSelector.log('Factory init');

    return MurucaFactory;

});